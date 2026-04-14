import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Create the submission in Neon DB via Prisma
    const submission = await prisma.contactSubmission.create({
      data: {
        type: data.type,
        name: data.name,
        email: data.email,
        countryCode: data.countryCode,
        mobile: data.mobile,
        company: data.company,
        source: data.source,
        message: data.message,
        
        // Shipper fields
        cargoType: data.cargoType || null,
        cargoWeight: data.cargoWeight || null,
        typeOfTruck: data.typeOfTruck || null,
        noOfTrucks: data.noOfTrucks || null,
        repeatOrder: data.repeatOrder || null,

        // Carrier fields
        fleetSize: data.fleetSize || null,
        operationalRegions: data.operationalRegions || null,
        truckTypesAvailable: data.truckTypesAvailable || [],
        otherTruckTypes: data.otherTruckTypes || null,
        regularContracts: data.regularContracts || null,
      }
    })

    return NextResponse.json({ success: true, id: submission.id })
  } catch (error: any) {
    console.error('Contact API Error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
