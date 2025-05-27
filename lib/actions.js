

'use server';
import path from 'path';
import { promises as fs } from 'fs'; // Use fs.promises for async operations
import connectMongoDB from './mongodb';
import ResumeEntry from '@/Models/ResumeEntry';
import OfficeEntry from '@/Models/OfficeEntry';
import bcrypt from 'bcrypt';
import { revalidatePath } from "next/cache";


export const createFormAction = async (formData) => {
  console.log('Server action: createFormAction function called');
  console.log('Received formData:', Array.from(formData.entries()));

  try {
    // Connect to MongoDB
    await connectMongoDB();
    console.log('Connected to MongoDB');

    // Extract fields
    const office = formData.get('office') ? JSON.parse(formData.get('office')) : [];
    const name = formData.get('name') || '';
    const passport_no = formData.get('passport_no') || '';
    const dob = formData.get('dob') || '';
    const position = formData.get('position') || '';
    const salary = parseFloat(formData.get('salary')) || 0;
    const contract = formData.get('contract') || '';
    const religion = formData.get('religion') || '';
    const social_status = formData.get('social_status') || '';
    const passport_expire_date = formData.get('passport_expire_date') || '';
    const place_of_birth = formData.get('place_of_birth') || '';
    const address = formData.get('address') || '';
    const education = formData.get('education') || '';
    const phone_number = formData.get('phone_number') || '';
    const passport_issue_place = formData.get('passport_issue_place') || '';
    const passport_issue_date = formData.get('passport_issue_date') || '';
    const height = parseFloat(formData.get('height')) || 0;
    const weight = parseFloat(formData.get('weight')) || 0;
    const no_of_kids = parseInt(formData.get('no_of_kids'), 10) || 0;
    const nationality = formData.get('nationality') || '';
    const experience = formData.get('experience') || '';
    const refference = formData.get('refference') || '';
    const cv_video = formData.get('cv_video') || '';
    // Basic validation
    if (!name || !passport_no || !dob) {
      throw new Error('Name, Passport Number, and Date of Birth are required.');
    }

    // Handle file uploads
    const picture = formData.get('picture');
    const passport_image = formData.get('passport_image');
    const visas = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("visas[")) {
        visas.push(value);
      }
    }
    console.log("Recived Visas" , visas)
    const uploadDir = path.join(process.cwd(), 'uploads');

    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // File processing function
    const processFile = async (file, customName) => {
      if (!file || !file.name) return null;
      const extension = path.extname(file.name);
      const safeName = customName ? customName.replace(/[^a-zA-Z0-9-_]/g, '_') : 'default_file';
      const fileName = `${safeName}${extension}`;
      const filePath = path.join(uploadDir, fileName);
      const publicPath = `/uploads/${fileName}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      return publicPath;
    };

    // Process files
    const fileUrls = {
      picture: picture ? await processFile(picture, `${name}_picture`) : null,
      passport_image: passport_image ? await processFile(passport_image, `${passport_no}_passport`) : null,
      cv_video: cv_video ? await processFile(cv_video, `${name}_cv_video`) : null,
      visas: [],
    };

    // Process multiple visas
    for (let i = 0; i < visas.length; i++) {
      const visaFile = visas[i];
      if (visaFile) {
        const visaPath = await processFile(visaFile, `${passport_no}_visa_${i + 1}`);
        if (visaPath) fileUrls.visas.push(visaPath);
      }
    }

    // Prepare form data
    const formDataToSave = {
      office,
      name,
      passport_no,
      dob,
      position,
      salary,
      contract,
      religion,
      social_status,
      passport_expire_date,
      passport_issue_date,
      passport_issue_place,
      phone_number,
      address,
      place_of_birth,
      education,
      height,
      weight,
      no_of_kids,
      nationality,
      experience,
      refference,
      approved_office: "",
      ...fileUrls,
    };

    console.log('Form data to be saved:', formDataToSave);

    // Create entry in MongoDB
    const newEntry = await ResumeEntry.create(formDataToSave);
    const plainEntry = newEntry.toObject();

    // Revalidate pages
    revalidatePath("/AdminDashboard");
    revalidatePath("/UserDashboard");

    console.log('Form entry created:', plainEntry);
    return plainEntry;
  } catch (error) {
    console.error('Error creating form entry:', error);
    throw new Error(error.message || 'Error creating form entry');
  }
};

export const deleteResume = async (id) => {
  try {
    await connectMongoDB();
    const result = await ResumeEntry.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new Error('No resume entry found to delete');
    }
    revalidatePath("/AdminDashboard","/UserDashboard")
    console.log('Resume entry deleted successfully');
    return { ok: true };
  } catch (error) {
    console.error('Error deleting resume entry:', error);
    throw new Error('Error deleting resume entry');
  }
};
export const deleteUser = async (id) => {
  try {
    await connectMongoDB();
    const result = await OfficeEntry.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new Error('No office entry found to delete');
    }
    revalidatePath("/AdminDashboard","/UserDashboard")
    console.log('Office deleted successfully');
    return { ok: true };
  } catch (error) {
    console.error('Error deleting office entry:', error);
    throw new Error('Error deleting office entry');
  }
};

// export const editFormAction = async (formData, resumeId) => {
//   console.log('Server action: editFormAction function called' + resumeId);
//   console.log('Received formData:', Array.from(formData.entries()));

//   try {
//     // Connect to MongoDB
//     await connectMongoDB();
//     console.log('Connected to MongoDB');

//     // Find existing resume by ID
//     const existingResume = await ResumeEntry.findById(resumeId);
//     if (!existingResume) {
//       throw new Error('Resume entry not found');
//     }

//     // Extract scalar fields
//     const updatedData = {
//       office: formData.get('office') ? JSON.parse(formData.get('office')) : existingResume.office,
//       name: formData.get('name') || existingResume.name,
//       passport_no: formData.get('passport_no') || existingResume.passport_no,
//       dob: formData.get('dob') || existingResume.dob,
//       position: formData.get('position') || existingResume.position,
//       salary: parseFloat(formData.get('salary')) || existingResume.salary,
//       contract: formData.get('contract') || existingResume.contract,
//       religion: formData.get('religion') || existingResume.religion,
//       social_status: formData.get('social_status') || existingResume.social_status,
//       passport_expire_date: formData.get('passport_expire_date') || existingResume.passport_expire_date,
//       passport_issue_place: formData.get('passport_issue_place') || existingResume.passport_issue_place,
//       passport_issue_date: formData.get('passport_issue_date') || existingResume.passport_issue_date,
//       place_of_birth: formData.get('place_of_birth') || existingResume.place_of_birth,
//       address: formData.get('address') || existingResume.address,
//       education: formData.get('education') || existingResume.education,
//       phone_number: formData.get('phone_number') || existingResume.phone_number,
//       height: parseFloat(formData.get('height')) || existingResume.height,
//       weight: parseFloat(formData.get('weight')) || existingResume.weight,
//       no_of_kids: parseInt(formData.get('no_of_kids'), 10) || existingResume.no_of_kids,
//       nationality: formData.get('nationality') || existingResume.nationality,
//       experience: formData.get('experience') || existingResume.experience,
//       refference: formData.get('refference') || existingResume.refference,
      
//     };

//     // Handle file uploads
//     const picture = formData.get('picture');
//     const passport_image = formData.get('passport_image');
//     const uploadDir = path.join(process.cwd(), 'uploads');

//     // Ensure the upload directory exists
//     await fs.mkdir(uploadDir, { recursive: true });

//     const fileUrls = {};

//     // Helper function to process file uploads
//     const processFile = async (file, key, customName) => {
//       if (!file || !file.name) {
//         console.warn(`Invalid file for key: ${key}`);
//         return null;
//       }

//       const extension = path.extname(file.name);
//       const safeName = customName.replace(/[^a-zA-Z0-9-_]/g, '_');
//       const fileName = `${safeName}${extension}`;
//       const filePath = path.join(uploadDir, fileName);
//       const publicPath = `/uploads/${fileName}`; // Ensuring consistency with createFormAction

//       // Convert file to Buffer and save it
//       const buffer = Buffer.from(await file.arrayBuffer());
//       await fs.writeFile(filePath, buffer);

//       fileUrls[key] = publicPath;
//     };

//     // Process new images if provided
//     if (picture) {
//       await processFile(picture, 'picture', updatedData.name || 'default_picture');
//     }
//     if (passport_image) {
//       await processFile(passport_image, 'passport_image', updatedData.passport_no || 'default_passport');
//     }

//     // Merge file URLs into updated data
//     const updatedResume = await ResumeEntry.findByIdAndUpdate(
//       resumeId,
//       { ...updatedData, ...fileUrls },
//       { new: true }
//     );

//     const plainEntry = JSON.parse(JSON.stringify(updatedResume));
//     await refreshAdminDashboard();
//     // Return the updated entry
//     return plainEntry;
//   } catch (error) {
//     console.error('Error updating form entry:', error);
//     throw new Error('Error updating form entry');
//   }
// };


// export const editFormAction = async (formData, resumeId) => {
//   console.log('Server action: editFormAction function called', resumeId);
//   console.log('Received formData:', Array.from(formData.entries()));

//   try {
//     // Connect to MongoDB
//     await connectMongoDB();
//     console.log('Connected to MongoDB');

//     // Find existing resume by ID
//     const existingResume = await ResumeEntry.findById(resumeId);
//     if (!existingResume) {
//       throw new Error('Resume entry not found');
//     }

//     // Extract scalar fields
//     const updatedData = {
//       office: formData.get('office') ? JSON.parse(formData.get('office')) : existingResume.office,
//       name: formData.get('name') || existingResume.name,
//       passport_no: formData.get('passport_no') || existingResume.passport_no,
//       dob: formData.get('dob') || existingResume.dob,
//       position: formData.get('position') || existingResume.position,
//       salary: parseFloat(formData.get('salary')) || existingResume.salary,
//       contract: formData.get('contract') || existingResume.contract,
//       religion: formData.get('religion') || existingResume.religion,
//       social_status: formData.get('social_status') || existingResume.social_status,
//       passport_expire_date: formData.get('passport_expire_date') || existingResume.passport_expire_date,
//       passport_issue_place: formData.get('passport_issue_place') || existingResume.passport_issue_place,
//       passport_issue_date: formData.get('passport_issue_date') || existingResume.passport_issue_date,
//       place_of_birth: formData.get('place_of_birth') || existingResume.place_of_birth,
//       address: formData.get('address') || existingResume.address,
//       education: formData.get('education') || existingResume.education,
//       phone_number: formData.get('phone_number') || existingResume.phone_number,
//       height: parseFloat(formData.get('height')) || existingResume.height,
//       weight: parseFloat(formData.get('weight')) || existingResume.weight,
//       no_of_kids: parseInt(formData.get('no_of_kids'), 10) || existingResume.no_of_kids,
//       nationality: formData.get('nationality') || existingResume.nationality,
//       experience: formData.get('experience') || existingResume.experience,
//       refference: formData.get('refference') || existingResume.refference,
//     };

//     // Handle file uploads
//     const picture = formData.get('picture');
//     const passport_image = formData.get('passport_image');
//     const visas = [];
//     for (const [key, value] of formData.entries()) {
//       if (key.startsWith("visas[")) {
//         visas.push(value);
//       }
//     }
//     console.log("Received Visas", visas);

//     const uploadDir = path.join(process.cwd(), 'uploads');
//     await fs.mkdir(uploadDir, { recursive: true });

//     const fileUrls = { visas: existingResume.visas || [] };

//     const processFile = async (file, key, customName) => {
//       if (!file || !file.name) {
//         console.warn(`Invalid file for key: ${key}`);
//         return null;
//       }

//       const extension = path.extname(file.name);
//       const safeName = (customName || 'default_name').replace(/[^a-zA-Z0-9-_]/g, '_');
//       const fileName = `${safeName}${extension}`;
//       const filePath = path.join(uploadDir, fileName);
//       const publicPath = `/uploads/${fileName}`;

//       const buffer = Buffer.from(await file.arrayBuffer());
//       await fs.writeFile(filePath, buffer);

//       return publicPath;
//     };

//     if (picture) {
//       fileUrls.picture = await processFile(picture, 'picture', updatedData.name || 'default_picture');
//     }
//     if (passport_image) {
//       fileUrls.passport_image = await processFile(passport_image, 'passport_image', updatedData.passport_no || 'default_passport');
//     }

//     // Process new visa files and append to existing visas
//     for (let i = 0; i < visas.length; i++) {
//       const visaFile = visas[i];
//       if (visaFile) {
//         const visaPath = await processFile(visaFile, `visa_${existingResume.passport_no}_${i + 1}`);
//         if (visaPath) fileUrls.visas.push(visaPath);
//       }
//     }

//     // Update MongoDB entry
//     const updatedResume = await ResumeEntry.findByIdAndUpdate(
//       resumeId,
//       { ...updatedData, ...fileUrls },
//       { new: true }
//     );

//     const plainEntry = JSON.parse(JSON.stringify(updatedResume));
//     await refreshAdminDashboard();

//     return plainEntry;
//   } catch (error) {
//     console.error('Error updating form entry:', error);
//     throw new Error('Error updating form entry');
//   }
// };


export const editFormAction = async (formData, resumeId) => {
  console.log('Server action: editFormAction function called', resumeId);
  console.log('Received formData:', Array.from(formData.entries()));

  try {
    // Connect to MongoDB
    await connectMongoDB();
    console.log('Connected to MongoDB');

    // Find existing resume
    const existingResume = await ResumeEntry.findById(resumeId);
    if (!existingResume) {
      throw new Error('Resume entry not found');
    }

    // Extract scalar fields from formData
    const updatedData = {
      office: formData.get('office') ? JSON.parse(formData.get('office')) : existingResume.office,
      name: formData.get('name') || existingResume.name,
      passport_no: formData.get('passport_no') || existingResume.passport_no,
      dob: formData.get('dob') || existingResume.dob,
      position: formData.get('position') || existingResume.position,
      salary: parseFloat(formData.get('salary')) || existingResume.salary,
      contract: formData.get('contract') || existingResume.contract,
      religion: formData.get('religion') || existingResume.religion,
      social_status: formData.get('social_status') || existingResume.social_status,
      passport_expire_date: formData.get('passport_expire_date') || existingResume.passport_expire_date,
      passport_issue_place: formData.get('passport_issue_place') || existingResume.passport_issue_place,
      passport_issue_date: formData.get('passport_issue_date') || existingResume.passport_issue_date,
      place_of_birth: formData.get('place_of_birth') || existingResume.place_of_birth,
      address: formData.get('address') || existingResume.address,
      education: formData.get('education') || existingResume.education,
      phone_number: formData.get('phone_number') || existingResume.phone_number,
      height: parseFloat(formData.get('height')) || existingResume.height,
      weight: parseFloat(formData.get('weight')) || existingResume.weight,
      no_of_kids: parseInt(formData.get('no_of_kids'), 10) || existingResume.no_of_kids,
      nationality: formData.get('nationality') || existingResume.nationality,
      experience: formData.get('experience') || existingResume.experience,
      refference: formData.get('refference') || existingResume.refference,
    };

    // Extract files from formData
    const picture = formData.get('picture');
    const passport_image = formData.get('passport_image');

    // Extract visa URLs from the frontend
    const visasFromFrontend = formData.getAll('visas'); // Only URLs

    // Extract visa files from formData
    const visaFiles = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("visas") && value instanceof File) {
        visaFiles.push(value);
      }
    }

    console.log("Received Visa URLs:", visasFromFrontend);
    console.log("Received Visa Files:", visaFiles);

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    // Preserve existing file paths
    let updatedVisas = existingResume.visas ? [...existingResume.visas] : [];

    // Retain only the visas still present in the frontend submission
    updatedVisas = updatedVisas.filter(visaUrl => visasFromFrontend.includes(visaUrl));

    console.log("Retained Visa URLs:", updatedVisas);

    // Function to process and save files
    const processFile = async (file, key, customName) => {
      if (!file || !file.name) return null;

      const extension = path.extname(file.name);
      const safeName = (customName || 'default_name').replace(/[^a-zA-Z0-9-_]/g, '_');
      const fileName = `${safeName}${extension}`;
      const filePath = path.join(uploadDir, fileName);
      const publicPath = `/uploads/${fileName}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      return publicPath;
    };

    // Process and store picture and passport_image
    const fileUrls = {
      visas: updatedVisas,
      picture: existingResume.picture,
      passport_image: existingResume.passport_image
    };

    if (picture instanceof File) {
      fileUrls.picture = await processFile(picture, 'picture', updatedData.name || 'default_picture');
    }
    if (passport_image instanceof File) {
      fileUrls.passport_image = await processFile(passport_image, 'passport_image', updatedData.passport_no || 'default_passport');
    }

    // Append new visa files while keeping existing ones
    for (let i = 0; i < visaFiles.length; i++) {
      const visaPath = await processFile(
        visaFiles[i],
        `visa_${updatedData.passport_no}_${updatedVisas.length + i + 1}`,
        `${updatedData.passport_no}_visa_${updatedVisas.length + i + 1}`
      );
      if (visaPath) updatedVisas.push(visaPath);
    }

    // Store the updated visa array
    fileUrls.visas = updatedVisas;

    // Update MongoDB entry
    const updatedResume = await ResumeEntry.findByIdAndUpdate(
      resumeId,
      { ...updatedData, ...fileUrls },
      { new: true }
    );

    const plainEntry = JSON.parse(JSON.stringify(updatedResume));
    console.log("Updated Entry:", plainEntry);

    return plainEntry;
  } catch (error) {
    console.error('Error updating form entry:', error);
    throw new Error('Error updating form entry');
  }
};



export const fetchAllResumes = async () => {
  try {
    await connectMongoDB();
    console.log('Connected to MongoDB for fetching resumes');

    const allResumes = await ResumeEntry.find().lean();
    // console.log('All resumes fetched:', allResumes);
    // Transform resumes to ensure they are plain objects
    return allResumes.map((resume) => ({
      ...resume,
      _id: resume._id.toString(), // Convert _id to string
      createdAt: resume.createdAt?.toISOString(), // Convert dates to ISO strings
      updatedAt: resume.updatedAt?.toISOString(),
    }));
    // revalidatePath("/AdminDashboard","/UserDashboard")
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw new Error('Error fetching resumes');
  }
};
export const fetchSingleResume = async (id) => {
  try {
    await connectMongoDB();
    console.log(`Connected to MongoDB for fetching resume with ID: ${id}`);

    // ✅ Ensure ID is valid
    

    const resume = await ResumeEntry.findById(id).lean();

    if (!resume) {
      throw new Error('Resume not found');
    }

    

    return {
      ...resume,
      _id: resume._id.toString(),
      createdAt: resume.createdAt?.toISOString(),
      updatedAt: resume.updatedAt?.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching single resume:', error);
    throw new Error('Error fetching resume');
  }
};

export const fetchAllOffices = async () => {
  try {
    // Ensure MongoDB is connected
    await connectMongoDB();

    // Fetch all offices from the database
    const offices = await OfficeEntry.find().lean();

    // Transform data to make it serializable
    return offices.map((office) => ({
      ...office,
      _id: office._id.toString(),
      createdAt: office.createdAt?.toISOString(),
      updatedAt: office.updatedAt?.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching offices:', error);
    throw new Error('Failed to fetch offices');
  }
};

export const fetchOfficeById = async (id) => {
  try {
    // Ensure MongoDB is connected
    await connectMongoDB();

    // Find the office by ID
    const office = await OfficeEntry.findById(id).lean();

    if (!office) {
      throw new Error("Office not found");
    }

    // Transform data to make it serializable
    return {
      ...office,
      _id: office._id.toString(),
      createdAt: office.createdAt?.toISOString(),
      updatedAt: office.updatedAt?.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching office:", error);
    throw new Error("Failed to fetch office");
  }
};


// export const createOffice = async (formData) => {
//   await connectMongoDB();

//   try {
//     const office_name = formData.get('office_name');
//     const office_number = formData.get('office_number');
//     const office_address = formData.get('office_address');
//     const office_email = formData.get('office_email');
//     const office_password = formData.get('office_password');
//     const office_logo = formData.get('office_logo');
//     const role = formData.get('role') || 'user'; // Default to 'user'

//     // Validate role
//     if (!['user', 'admin'].includes(role)) {
//       throw new Error('Invalid role. Must be either "user" or "admin".');
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(office_password, 10); // Salt rounds = 10

//     // Handle logo file if it exists
//     let logoPath = null;
//     if (office_logo && office_logo.name) {
//       const uploadDir = path.join(process.cwd(), 'public/office_logo');

//       // Ensure the directory exists
//       await fs.mkdir(uploadDir, { recursive: true });
//       const extension = path.extname(office_logo.name);
//       const fileName = `${office_name.replace(/[^a-zA-Z0-9-_]/g, '_')}${extension}`;
//       const filePath = path.join(uploadDir, fileName);

//       // Convert ArrayBuffer to Buffer
//       const buffer = Buffer.from(await office_logo.arrayBuffer());
//       await fs.writeFile(filePath, buffer);

//       logoPath = `/office_logo/${fileName}`; // Public URL for the logo
//     }

//     // Save data to the database
//     const newOffice = new OfficeEntry({
//       office_name,
//       office_number,
//       office_address,
//       office_email,
//       office_password: hashedPassword, // Save the hashed password
//       office_logo: logoPath,
//       role, // Save role in the database
//     });

//     await newOffice.save();
//     return { ok: true };
//   } catch (error) {
//     console.error('Error creating office:', error);
//     return { ok: false, error: error.message };
//   }
// };


// export const updateOffice = async (id, updatedData) => {
//   try {
//     await connectMongoDB();

//     const updatedOffice = await OfficeEntry.findByIdAndUpdate(id, updatedData, { new: true }).lean();

//     if (!updatedOffice) {
//       throw new Error("Office not found");
//     }

//     return {
//       ...updatedOffice,
//       _id: updatedOffice._id.toString(),
//       createdAt: updatedOffice.createdAt?.toISOString(),
//       updatedAt: updatedOffice.updatedAt?.toISOString(),
//     };
//   } catch (error) {
//     console.error("Error updating office:", error);
//     throw new Error("Failed to update office");
//   }
// };

export const updateOffice = async (id, updatedData) => {
  try {
    await connectMongoDB();
    console.log("update office Backend" , updatedData)

    let office_name, office_numbers = [], office_address, office_email, office_password, office_logo, role;

    // Handle FormData or JSON input
    if (updatedData instanceof FormData) {
      office_name = updatedData.get("office_name");
      for (let i = 0; updatedData.get(`office_numbers[${i}]`); i++) {
        office_numbers.push(updatedData.get(`office_numbers[${i}]`));
      }
      office_address = updatedData.get("office_address");
      office_email = updatedData.get("office_email");
      office_password = updatedData.get("office_password");
      office_logo = updatedData.get("office_logo");
      role = updatedData.get("role") || "user";
    } else {
      office_name = updatedData.office_name;
      for (let i = 0; updatedData[`office_numbers[${i}]`]; i++) {
        office_numbers.push(updatedData[`office_numbers[${i}]`]);
      }
      office_address = updatedData.office_address;
      office_email = updatedData.office_email;
      office_password = updatedData.office_password;
      office_logo = updatedData.office_logo;
      role = updatedData.role || "user";
    }

    // Handle password update
    let hashedPassword = null;
    if (office_password) {
      hashedPassword = await bcrypt.hash(office_password, 10);
    }

    // Handle logo update
    let logoPath = null;
    if (office_logo && office_logo.name) {
      const uploadDir = path.join(process.cwd(), "/office_logo");

      // Ensure directory exists
      await fs.mkdir(uploadDir, { recursive: true });

      const extension = path.extname(office_logo.name);
      const fileName = `${office_name.replace(/[^a-zA-Z0-9-_]/g, "_")}${extension}`;
      const filePath = path.join(uploadDir, fileName);

      // Convert ArrayBuffer to Buffer
      const buffer = Buffer.from(await office_logo.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      logoPath = `/office_logo/${fileName}`;
    }

    // Update the office entry
    const updatedOffice = await OfficeEntry.findByIdAndUpdate(
      id,
      {
        office_name,
        office_number: office_numbers,
        office_address,
        office_email,
        ...(hashedPassword && { office_password: hashedPassword }),
        ...(logoPath && { office_logo: logoPath }),
        role,
      },
      { new: true }
    ).lean();

    if (!updatedOffice) {
      throw new Error("Office not found");
    }
    await refreshAdminDashboard();
    return {
      ...updatedOffice,
      _id: updatedOffice._id.toString(),
      createdAt: updatedOffice.createdAt?.toISOString(),
      updatedAt: updatedOffice.updatedAt?.toISOString(),
    };
  } catch (error) {
    console.error("Error updating office:", error);
    throw new Error("Failed to update office");
  }
};

export const createOffice = async (formData) => {
  await connectMongoDB();

  try {
    const office_name = formData.get('office_name');
    const office_numbers = [];
    // Extract multiple phone numbers from the form data
    for (let i = 0; formData.get(`office_numbers[${i}]`); i++) {
      office_numbers.push(formData.get(`office_numbers[${i}]`));
    }
    const office_address = formData.get('office_address');
    const office_email = formData.get('office_email');
    const office_password = formData.get('office_password');
    const office_logo = formData.get('office_logo');
    const role = formData.get('role') || 'user'; // Default to 'user'

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      throw new Error('Invalid role. Must be either "user" or "admin".');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(office_password, 10); // Salt rounds = 10

    // Handle logo file if it exists
    let logoPath = null;
    if (office_logo && office_logo.name) {
      const uploadDir = path.join(process.cwd(), '/office_logo');

      // Ensure the directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      const extension = path.extname(office_logo.name);
      const fileName = `${office_name.replace(/[^a-zA-Z0-9-_]/g, '_')}${extension}`;
      const filePath = path.join(uploadDir, fileName);

      // Convert ArrayBuffer to Buffer
      const buffer = Buffer.from(await office_logo.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      logoPath = `/office_logo/${fileName}`; // Public URL for the logo
    }

    // Save data to the database
    const newOffice = new OfficeEntry({
      office_name,
      office_number:office_numbers, // Save office numbers as an array
      office_address,
      office_email,
      office_password: hashedPassword, // Save the hashed password
      office_logo: logoPath,
      role, // Save role in the database
    });

    await newOffice.save();
    await refreshAdminDashboard();
    return { ok: true };
  } catch (error) {
    console.error('Error creating office:', error);
    return { ok: false, error: error.message };
  }
};

export async function refreshAdminDashboard() {
  revalidatePath("/AdminDashboard");
  revalidatePath("/UserDashboard");
  revalidatePath("/AdminDashboard/AddEntry");
  revalidatePath("/AdminDashboard/AddUser");
  revalidatePath("/AdminDashboard/EditEntry");
  revalidatePath("/AdminDashboard/Users");
  revalidatePath("/UserDashboard/cv");
}

export const processLogin = async (formData) => {
  await connectMongoDB();

  try {
    const office_email = formData.get("office_email");
    const office_password = formData.get("office_password");

    if (!office_email || !office_password) {
      throw new Error("Email and password are required");
    }

    const user = await OfficeEntry.findOne({ office_email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
      office_password,
      user.office_password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return {
      ok: true,
      user: {
        id: user._id.toString(),
        office_name: user.office_name,
        role: user.role,
        office_logo:user.office_logo,
        office_number:user.office_number,
        office_email:user.office_email,
      },
    };
  } catch (error) {
    console.error("Error processing login:", error);
    throw new Error(error.message || "Failed to log in");
  }
};
export async function updateUserStatus(id, status,office) {
  if (!id || !status) {
      throw new Error('Invalid parameters');
  }

  await connectMongoDB();
  
  const updatadOffice = ["Approved", "Onhold"].includes(status) ? office : "";
  const result = await ResumeEntry.updateOne({ _id: id }, { $set: { status,approved_office: updatadOffice } });
  
  if (!result.acknowledged) {
      throw new Error('Failed to update status');
  }
  revalidatePath("/AdminDashboard","/UserDashboard");
  return { success: true, status };
}
export async function autoUpdateOnholdStatus() {
  await connectMongoDB();

  const seventyTwoHoursAgo = new Date();
  seventyTwoHoursAgo.setHours(seventyTwoHoursAgo.getHours() - 72);

  const result = await ResumeEntry.updateMany(
    { status: "Onhold", updatedAt: { $lte: seventyTwoHoursAgo } },
    { $set: { status: "Pending", approved_office: "" } }
  );

  revalidatePath("/AdminDashboard");
  revalidatePath("/UserDashboard");

  console.log(`Updated ${result.modifiedCount} records from "Onhold" to "Pending"`);
}
