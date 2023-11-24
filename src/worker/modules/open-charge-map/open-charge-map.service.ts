import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

import { OPEN_CHARGE_MAP_API_KEY } from '../../../common/config';
import {
  BATCH_SIZE,
  COORDINATES_LENGTH,
  OPEN_CHARGE_MAP_API_URL,
} from './constants';
import { POIItemResponse } from './types';

@Injectable()
export class OpenChargeMapService {
  private logger = new Logger(OpenChargeMapService.name);

  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: OPEN_CHARGE_MAP_API_URL,
      params: {
        key: OPEN_CHARGE_MAP_API_KEY,
        maxresults: BATCH_SIZE,
        camelcase: true,
        includecomments: false,
      },
    });

    axiosRetry(this.client, {
      retries: 3,
      retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, 1000),
      retryCondition: (error) =>
        [429, 500, 501].includes(error?.response?.status),
      onRetry: (retryCount) => {
        this.logger.warn({ retryCount }, 'Retry on request');
      },
    });
  }

  public async list(parameters: {
    lat1: number;
    lng1: number;
    lat2: number;
    lng2: number;
  }): Promise<{
    hasMore: boolean;
    data: POIItemResponse[]; // TODO: provide interface
  }> {
    const startAt = Date.now();

    const params = {
      boundingbox: this.getBouindingBox(parameters),
    };

    try {
      const response = await this.client<POIItemResponse[]>({
        method: 'GET',
        params,
      });

      this.logger.log(
        { params, processingTime: Date.now() - startAt },
        'Successfully requested POI list',
      );

      return {
        data: response.data,
        hasMore: response.data.length >= BATCH_SIZE,
      };
    } catch (error) {
      this.logger.error(error, 'Failed to request POI list');

      throw new Error('Failed to fetch POI list');
    }
  }

  private getBouindingBox({
    lat1,
    lng1,
    lat2,
    lng2,
  }: {
    lat1: number;
    lng1: number;
    lat2: number;
    lng2: number;
  }) {
    return [
      `(${this.formatCoordinate(lat1)},${this.formatCoordinate(lng1)})`,
      `(${this.formatCoordinate(lat2)},${this.formatCoordinate(lng2)})`,
    ].join(',');
  }

  private formatCoordinate = (value: number): string =>
    value.toFixed(COORDINATES_LENGTH);
}
