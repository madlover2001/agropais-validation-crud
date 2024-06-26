import { NextResponse } from "next/server" ;
import { dbConnect } from '@/utils/mongoose';
import Person from '@/models/Person'

export async function GET(request, {params}){
    try {
        dbConnect( )
        const personFound = await Person.findById(params.id)
        if (!personFound)
            return NextResponse.json({message: "Registro no encontrado"} ,{status: 404})
        return NextResponse.json(personFound);
    } catch (error) {
        return NextResponse. json(error.message, {
        status: 400
        })
    }
}

export async function DELETE(request, {params}){
    try{
        const personDeleted = await Person.findByIdAndDelete(params.id)
        if(!personDeleted)
            return NextResponse.json({message: "Registro no encontrado"},{status:400
        })
        return NextResponse.json(personDeleted)
    } catch (error) {
        return NextResponse. json(error.message, {
        status: 400
        })
    }
}

export async function PUT(request, {params}){
    try {
        const data = await request.json()
        const personUpdated = await Person.findByIdAndUpdate(params.id, data,{new:true})
        return NextResponse.json(personUpdated);
    } catch (error) {
        return NextResponse. json(error.message, {
        status: 400
        })
    }
}