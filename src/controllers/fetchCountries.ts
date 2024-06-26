import { promises as fs } from "fs";
import path from "path";
import { __dirname } from "../config/filepath.js";
import { Request,Response } from "express";
import { Country } from "../config/countryInterface.js";

const countryDataPath = path.join(__dirname, "../../countryData.json");

 export const fetchCountries = async (req:Request, res:Response):Promise<Response> => {
  try {
    const data = await fs.readFile(countryDataPath , 'utf-8');
    
    const allCountriesData:Country[] = JSON.parse(data);
    
    if (!Array.isArray(allCountriesData)) {
      return res.status(500).json({
        data: 'Invalid data structure',
        message: 'Expected an array of countries',
      });
    }

    const countries:string[] = allCountriesData.map((country) => country.name);

    if (countries.length === 0) {
      return res.status(404).json({
        data: [],
        message: 'No countries found',
      });
    }

    return res.status(200).json({
      data: countries,
      message: 'Successfully got the data of countries',
    });

  } catch (err) {
    return res.status(500).json({
      data: 'Internal server error',
      message: err.message,
    });
  }
};
