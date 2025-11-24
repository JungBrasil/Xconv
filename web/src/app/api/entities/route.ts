import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    try {
        // Import prisma only at runtime
        const { prisma } = await import('@/lib/db');

        const entities = await prisma.entity.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(entities);
    } catch (error) {
        console.error('Error fetching entities:', error);
        return NextResponse.json({ error: 'Failed to fetch entities' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // Import prisma only at runtime
        const { prisma } = await import('@/lib/db');

        const body = await request.json();
        const { name, cnpj, address, president, presidentCpf, presidentRole, active } = body;

        console.log('Creating entity:', { name, cnpj, address, president, presidentCpf, presidentRole, active });

        const entity = await prisma.entity.create({
            data: {
                name,
                cnpj,
                address,
                president,
                presidentCpf,
                presidentRole: presidentRole || 'Presidente',
                active: active !== undefined ? active : true
            }
        });

        console.log('Entity created:', entity);

        return NextResponse.json(entity, { status: 201 });
    } catch (error) {
        console.error('Error creating entity:', error);
        return NextResponse.json({
            error: 'Failed to create entity',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
