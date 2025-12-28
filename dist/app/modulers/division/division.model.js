"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Division = void 0;
const mongoose_1 = require("mongoose");
const divisionSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String }
}, {
    timestamps: true
});
// Document Middleware
// When creating a division : This hook will create slug and add into main data for creating
divisionSchema.pre("save", async function (next) {
    if (this.isModified("name")) {
        const baseSlug = this.name.toLocaleLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`;
        let counter = 0;
        while (await exports.Division.exists({ slug })) {
            slug = `${slug}-${counter++}`;
        }
        this.slug = slug;
    }
    next();
});
// Query Middleware
// When updating a division
divisionSchema.pre("findOneAndUpdate", async function (next) {
    const division = this.getUpdate();
    if (division.name) {
        const baseSlug = division.name.toLocaleLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`;
        let counter = 0;
        while (await exports.Division.exists({ slug })) {
            slug = `${slug}-${counter++}`;
        }
        division.slug = slug;
    }
    this.setUpdate(division);
    next();
});
exports.Division = (0, mongoose_1.model)("Division", divisionSchema);
//# sourceMappingURL=division.model.js.map