// File path: app/api/property-listings-by-agent/route.js (Next.js App Router)
// Or: pages/api/property-listings-by-agent.js (Next.js Pages Router)

import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// For Pages Router API routes, you'd use:
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(request) {
  try {
    // For App Router, we can use the native FormData parsing
    const formData = await request.formData();
    
    // Process the form data
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const propertyType = formData.get('propertyType');
    const propertyLocation = formData.get('propertyLocation');
    const bedrooms = formData.get('bedrooms');
    const bathrooms = formData.get('bathrooms');
    const propertySize = formData.get('propertySize');
    const preferredContactMethod = formData.get('preferredContactMethod');
    const additionalInfo = formData.get('additionalInfo');
    const availabilityForVisit = formData.get('availabilityForVisit');
    const urgency = formData.get('urgency');
    const emiratesId = formData.get('emiratesId');
    const passportNumber = formData.get('passportNumber');
    
    // Get the PDF file
    const file = formData.get('propertyPDF');
    
    let fileData = null;
    if (file && file.size > 0) {
      // Create the uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'uploads', 'property-documents');
      
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        console.error('Error creating upload directory:', err);
      }
      
      // Generate a unique filename
      const fileExtension = file.name.split('.').pop();
      const uniqueFilename = `${uuidv4()}.${fileExtension}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      
      // Convert the file to ArrayBuffer and save it
      const buffer = await file.arrayBuffer();
      await writeFile(filePath, Buffer.from(buffer));
      
      fileData = {
        filename: uniqueFilename,
        originalName: file.name,
        path: filePath,
        size: file.size
      };
    }
    
    // Log the received data
    console.log('Form data received:', {
      name,
      email,
      phone,
      propertyType,
      propertyLocation,
      bedrooms,
      bathrooms,
      propertySize,
      preferredContactMethod,
      additionalInfo,
      availabilityForVisit,
      urgency,
      emiratesId,
      passportNumber,
      fileData
    });
    
    // Here you would save the form data and file reference to your database
    // Example using a hypothetical database model:
    // const propertyListing = await PropertyListing.create({
    //   name,
    //   email,
    //   phone,
    //   propertyType,
    //   propertyLocation,
    //   bedrooms,
    //   bathrooms,
    //   propertySize,
    //   preferredContactMethod,
    //   additionalInfo,
    //   availabilityForVisit,
    //   urgency,
    //   emiratesId,
    //   passportNumber,
    //   documentPath: fileData ? fileData.path : null,
    //   documentName: fileData ? fileData.originalName : null
    // });
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Property listing created successfully',
      // listingId: propertyListing.id
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error handling property listing submission:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create property listing',
      error: error.message
    }, { status: 500 });
  }
}