'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './new.module.css';

export default function NewEntityPage() {
    const router = useRouter();
    const { addEntity } = useApp();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        cnpj: '',
        president: '',
        presidentCpf: '',
        presidentRole: 'Presidente',
        active: true,
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Montar endereço completo
            const fullAddress = `${formData.street}, ${formData.number} - ${formData.neighborhood} - ${formData.city}/${formData.state}${formData.zipCode ? ' - CEP: ' + formData.zipCode : ''}`;

            // Criar entidade via API
            const response = await fetch('/api/entities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    cnpj: formData.cnpj,
                    address: fullAddress,
                    president: formData.president,
                    presidentCpf: formData.presidentCpf,
                    presidentRole: formData.presidentRole,
                    active: formData.active
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar entidade');
            }

            const newEntity = await response.json();

            // Atualizar contexto local
            addEntity(newEntity);

            setIsLoading(false);
            router.push('/entities');
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao cadastrar entidade. Tente novamente.');
            setIsLoading(false);
        }
    };

    const estados = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    return (
        <div className="container animate-fade-in">
            <div className={styles.header}>
                <div>
                    <h1>Nova Entidade</h1>
                    <p className="text-muted">Cadastre uma nova organização para iniciar parcerias.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.formLayout}>
                <Card title="Dados Institucionais" variant="glass">
                    <div className={styles.grid}>
                        <div className={styles.fieldFull}>
                            <label htmlFor="name" className="required">Razão Social</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nome completo da organização"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="cnpj" className="required">CNPJ</label>
                            <input
                                type="text"
                                id="cnpj"
                                name="cnpj"
                                required
                                placeholder="00.000.000/0000-00"
                                value={formData.cnpj}
                                onChange={handleChange}
                                maxLength={18}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="president" className="required">Presidente/Responsável</label>
                            <input
                                type="text"
                                id="president"
                                name="president"
                                required
                                value={formData.president}
                                onChange={handleChange}
                                placeholder="Nome do presidente ou responsável"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="presidentCpf" className="required">CPF do Responsável</label>
                            <input
                                type="text"
                                id="presidentCpf"
                                name="presidentCpf"
                                required
                                value={formData.presidentCpf}
                                onChange={handleChange}
                                placeholder="000.000.000-00"
                                maxLength={14}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="presidentRole" className="required">Cargo do Responsável</label>
                            <select
                                id="presidentRole"
                                name="presidentRole"
                                required
                                value={formData.presidentRole}
                                onChange={handleChange}
                            >
                                <option value="Presidente">Presidente</option>
                                <option value="Vice-Presidente">Vice-Presidente</option>
                                <option value="Diretor">Diretor</option>
                                <option value="Coordenador">Coordenador</option>
                                <option value="Secretário">Secretário</option>
                                <option value="Tesoureiro">Tesoureiro</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="active">Status da Entidade</label>
                            <select
                                id="active"
                                name="active"
                                value={formData.active ? 'true' : 'false'}
                                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.value === 'true' }))}
                            >
                                <option value="true">✅ Ativa</option>
                                <option value="false">❌ Inativa</option>
                            </select>
                        </div>
                    </div>
                </Card>

                <Card title="Endereço" variant="glass">
                    <div className={styles.grid}>
                        <div className={styles.field}>
                            <label htmlFor="zipCode">CEP</label>
                            <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                placeholder="00000-000"
                                maxLength={9}
                            />
                        </div>

                        <div className={styles.fieldFull}>
                            <label htmlFor="street" className="required">Rua/Avenida</label>
                            <input
                                type="text"
                                id="street"
                                name="street"
                                required
                                value={formData.street}
                                onChange={handleChange}
                                placeholder="Nome da rua ou avenida"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="number" className="required">Número</label>
                            <input
                                type="text"
                                id="number"
                                name="number"
                                required
                                value={formData.number}
                                onChange={handleChange}
                                placeholder="123"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="neighborhood" className="required">Bairro</label>
                            <input
                                type="text"
                                id="neighborhood"
                                name="neighborhood"
                                required
                                value={formData.neighborhood}
                                onChange={handleChange}
                                placeholder="Nome do bairro"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="city" className="required">Cidade</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Nome da cidade"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="state" className="required">Estado</label>
                            <select
                                id="state"
                                name="state"
                                required
                                value={formData.state}
                                onChange={handleChange}
                            >
                                <option value="">Selecione...</option>
                                {estados.map(estado => (
                                    <option key={estado} value={estado}>{estado}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Card>

                <div className={styles.actions}>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="gradient"
                        isLoading={isLoading}
                    >
                        {isLoading ? 'Cadastrando...' : 'Cadastrar Entidade'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
