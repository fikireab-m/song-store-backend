import { checkSchema } from "express-validator";

export const artistValidator = () =>
    checkSchema({
        fname: { isLength: { options: { min: 1, max: 20 }, errorMessage: "Name should be non empty string at most 20 characters long" } },
        lname: { isLength: { options: { min: 1, max: 20 }, errorMessage: "Name should be non empty string at most 20 characters long" } },
        avatar: { isURL: true, errorMessage: "Invalid avatar url" }
    })
