import Tour from "../models/tourModel";
import factory = require ('./factory');


export const getAllTours = factory.getAll (Tour);
export const createTour = factory.createOne (Tour);
export const getTour = factory.getOne (Tour);
export const updateTour = factory.updateOne (Tour);
export const deleteTour = factory.deleteOne (Tour);