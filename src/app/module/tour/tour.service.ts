import { Query } from "mongoose";
import { excludeField } from "../../constant";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourtype } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { promise } from "zod";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error("A tour with this title already exists.");
  }

  if (payload.title) {
    const baseSlug = payload.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`; // dhaka-division-2
    }

    payload.slug = slug;
  }

  const tour = await Tour.create(payload);

  return tour;
};

// const getAllTours = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query.fields?.split(",").join(" ");
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 2;
//   const skip = (page - 1) * limit;
//   // delete filter["searchTerm"]
//   // delete filter["sort"]

//   for (const field of excludeField) {
//     delete filter[field];
//   }

//   const searchObject = {
//     $or: tourSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };
//   // const tours = await Tour.find(
//   //   // title:{$regex:searchTerm,$options:"i"}
//   //   // $or:
//   //   //  [
//   //   // { title: { $regex: searchTerm, $options: "i" } },
//   //   // { description: { $regex: searchTerm, $options: "i" } },
//   //   // { location: { $regex: searchTerm, $options: "i" } },
//   //   searchArray
//   //   // ],
//   // )
//   //   .find(filter)
//   //   .sort(sort)
//   //   .select(fields)
//   //   .skip(skip)
//   //   .limit(limit);

//   const filterQuery = Tour.find(filter);
//   const tours = filterQuery.find(searchObject);
//   const allTours = await tours
//     .sort(sort)
//     .limit(limit)
//     .skip(skip)
//     .select(fields);

//   const totalDocuments = await Tour.countDocuments();

//   const meta = {
//     page: page,
//     total: totalDocuments,
//     totalPage: Math.ceil(totalDocuments / limit),
//   };
//   return {
//     data: allTours,
//     meta: meta,
//   };
// };

const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);
  const tours = await queryBuilder
    .filter()
    .search(tourSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  // const meta = await queryBuilder.getMeta()
  return {
    data,
    meta,
  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  if (payload.images && existingTour.images && existingTour.images.length > 0) {
    payload.images = [...payload.images, ...existingTour.images];
  }

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    const restDbImages = existingTour.images.filter(
      (imageUrl) => !payload.images?.includes(imageUrl)
    );

    const updatedPayloadImages = (payload.images || [])
      .filter((imageUrl) => !payload.images?.includes(imageUrl))
      .filter((imageUrl) => !restDbImages.includes(imageUrl));
    payload.images = [...restDbImages, ...updatedPayloadImages];
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    await Promise.all(payload.deleteImages.map(url =>deleteImageFromCloudinary(url)))
  }

  return updatedTour;
};

const deleteTour = async (id: string) => {
  return await Tour.findByIdAndDelete(id);
};

const createTourType = async (payload: ITourtype) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }

  return await TourType.create({ name: payload.name });
};
const getAllTourTypes = async () => {
  return await TourType.find();
};
const updateTourType = async (id: string, payload: ITourtype) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedTourType;
};
const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  return await TourType.findByIdAndDelete(id);
};

export const TourService = {
  createTour,
  createTourType,
  deleteTourType,
  updateTourType,
  getAllTourTypes,
  getAllTours,
  updateTour,
  deleteTour,
};
