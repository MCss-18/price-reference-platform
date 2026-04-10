import { ServiceController } from "./service.controller";
import { ServiceService } from "./service.service";

const serviceService = new ServiceService();
const serviceController = new ServiceController(serviceService);

export { serviceService, serviceController };