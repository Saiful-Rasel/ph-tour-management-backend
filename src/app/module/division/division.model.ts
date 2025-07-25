import { model, Schema } from "mongoose";
import { Idivision } from "./division.interface";
import { NextFunction } from "express";

const divisionSchema = new Schema<Idivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;
    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    this.slug = slug;
  }

  next();
});

divisionSchema.pre("findOneAndUpdate", async function (next) {
  const division = this.getUpdate() as Partial<Idivision>;
  if (division.name) {
    const baseSlug = division.name
      .toLowerCase()
      .toLowerCase()
      .split(" ")
      .join("-");
    let slug = `${baseSlug}-division`;
    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    division.slug = slug;
  }
  this.setUpdate(division);
  next();
});

export const Division = model<Idivision>("Division", divisionSchema);
