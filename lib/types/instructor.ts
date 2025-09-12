export interface InstructorForm {
  name: string;
  designation: string;
  about: string;
  qualifications: string; // still as single string (later split into array)
  email: string;
  number: string;
  emergencyNumber: string;
}


export interface Instructor {
  _id: string;
  name: string;
  designation: string;
  about: string;
  qualifications: string[];
  image: string;
  email?: string;
  phone?: string;
  cloudinaryImageId?:string;
}
