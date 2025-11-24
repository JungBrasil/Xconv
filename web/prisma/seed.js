const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Seed Entities
    await prisma.entity.createMany({
        data: [
            { id: '1', name: 'Associação Amigos do Bairro', cnpj: '12.345.678/0001-90', address: 'Rua das Flores, 123', president: 'João da Silva', auditorNotes: 'Documentação regular.' },
            { id: '2', name: 'Instituto Criança Feliz', cnpj: '98.765.432/0001-10', address: 'Av. Central, 500', president: 'Maria Oliveira', auditorNotes: 'Pendente certidão estadual.' },
            { id: '3', name: 'ONG Viver Bem', cnpj: '11.222.333/0001-55', address: 'Praça da Paz, 45', president: 'Carlos Santos' },
        ],
        skipDuplicates: true
    });

    console.log('✅ Seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
