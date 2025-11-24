import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    try {
        // Import prisma only at runtime
        const { prisma } = await import('@/lib/db');

        const proposals = await prisma.proposal.findMany({
            include: {
                workPlan: {
                    include: {
                        goals: true,
                        financialPlan: true
                    }
                },
                documents: true,
                entity: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(proposals);
    } catch (error) {
        console.error('Error fetching proposals:', error);
        return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // Import prisma only at runtime
        const { prisma } = await import('@/lib/db');

        const body = await request.json();
        const { entityId, object, value, status, workPlan } = body;

        const proposal = await prisma.proposal.create({
            data: {
                entityId,
                object,
                value: parseFloat(value),
                status: status || 'DRAFT',
                workPlan: workPlan ? {
                    create: {
                        justification: workPlan.justification,
                        targetAudience: workPlan.targetAudience,
                        goals: {
                            create: workPlan.goals || []
                        },
                        financialPlan: {
                            create: workPlan.financialPlan || []
                        }
                    }
                } : undefined
            },
            include: {
                workPlan: {
                    include: {
                        goals: true,
                        financialPlan: true
                    }
                }
            }
        });

        return NextResponse.json(proposal, { status: 201 });
    } catch (error) {
        console.error('Error creating proposal:', error);
        return NextResponse.json({
            error: 'Failed to create proposal',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
