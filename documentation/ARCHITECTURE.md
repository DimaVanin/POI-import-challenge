# High-level architectural diagram

![High-level architectural diagram](./high-level-architecture.jpg)

* *API service*. TODO: provides detailed description for this lightweight service, that it provides interfaces to query POI data + trigger new command to import/synchronize POI for new region.
* *Worker*. TODO: provides detailed description for the service that it contains main logic to import POI data in the background and asynchronously
* *Scheduler*. TODO: provides detailed description for the scheduler that it should be deployed only as a single instance, periodically triggers commands to import/synchronize POI data based on config (provide several options...)
* *Messages queue*. TODO: add description and requirements to it
* *MongoDB*. TODO: add description and requirements to it
* *Monitoring*. TODO: add description and requirements to it

// TODO: add event bus or messages bus to notify that POI is synced
// TODO: add ideas and its description how to improve or develop current implementation
