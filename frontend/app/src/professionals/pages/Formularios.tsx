import { useState } from 'react';
import { Plus, Copy, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/professionals/context/AppContext';
import { FormularioPreConsulta, FormularioPergunta } from '../types';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

export const Formularios = () => {
  const { formularios, updateFormularios } = useApp();
  const [formularioEditando, setFormularioEditando] = useState<string | null>(null);

  const perguntasPadrao: FormularioPergunta[] = [
    { id: '1', pergunta: 'Qual o motivo principal da consulta?', tipo: 'texto', obrigatoria: true },
    { id: '2', pergunta: 'Quais são os sintomas principais e há quanto tempo?', tipo: 'texto', obrigatoria: true },
    { id: '3', pergunta: 'Como você avalia seu humor atual? (0-10)', tipo: 'escala', obrigatoria: true },
    { id: '4', pergunta: 'Como você avalia seu nível de ansiedade? (0-10)', tipo: 'escala', obrigatoria: true },
    { id: '5', pergunta: 'Como está a qualidade do seu sono? (0-10)', tipo: 'escala', obrigatoria: true },
    { id: '6', pergunta: 'Já fez tratamento psicológico ou psiquiátrico anteriormente?', tipo: 'texto', obrigatoria: false },
    { id: '7', pergunta: 'Está fazendo uso de alguma medicação?', tipo: 'texto', obrigatoria: false },
    { id: '8', pergunta: 'Quais são seus principais fatores de estresse atualmente?', tipo: 'texto', obrigatoria: false },
    { id: '9', pergunta: 'Como está sua rede de apoio (família, amigos)?', tipo: 'texto', obrigatoria: false },
    { id: '10', pergunta: 'Preferência de modalidade', tipo: 'multipla', opcoes: ['Presencial', 'Online', 'Sem preferência'], obrigatoria: true },
  ];

  const handleNovoFormulario = () => {
    const novo: FormularioPreConsulta = {
      id: Date.now().toString(),
      nome: 'Formulário de Pré-consulta',
      perguntas: [...perguntasPadrao],
      ativo: true,
    };
    updateFormularios([...formularios, novo]);
    toast({ title: '✓ Formulário criado' });
  };

  const gerarLink = (formularioId: string) => {
    const link = `${window.location.origin}/formulario/${formularioId}`;
    navigator.clipboard.writeText(link);
    toast({ title: '✓ Link copiado para a área de transferência' });
  };

  const enviarWhatsApp = (formularioId: string, telefone: string = '5511999999999') => {
    const link = `${window.location.origin}/formulario/${formularioId}`;
    const mensagem = `Olá! Para otimizar nossa consulta, por favor preencha este breve formulário de pré-consulta: ${link}`;
    const url = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    toast({ title: '✓ Abrindo WhatsApp...' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Formulários de Pré-consulta</h1>
          <p className="text-muted-foreground">
            Configure e envie formulários para pacientes
          </p>
        </div>
        <Button onClick={handleNovoFormulario}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Formulário
        </Button>
      </div>

      {/* Formulários */}
      {formularios.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum formulário criado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie seu primeiro formulário de pré-consulta
            </p>
            <Button onClick={handleNovoFormulario}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Formulário
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {formularios.map((form) => (
            <Card key={form.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Input
                      value={form.nome}
                      onChange={(e) => {
                        const updated = formularios.map(f =>
                          f.id === form.id ? { ...f, nome: e.target.value } : f
                        );
                        updateFormularios(updated);
                      }}
                      className="font-semibold text-lg border-none p-0 h-auto"
                    />
                    <Badge variant={form.ativo ? 'default' : 'outline'}>
                      {form.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => gerarLink(form.id)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar Link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => enviarWhatsApp(form.id)}
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Enviar via WhatsApp
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {form.perguntas.length} pergunta{form.perguntas.length !== 1 ? 's' : ''}
                  </p>

                  {formularioEditando === form.id ? (
                    <div className="space-y-4 border-t pt-4">
                      {form.perguntas.map((pergunta, index) => (
                        <div key={pergunta.id} className="p-3 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <span className="text-sm font-medium text-muted-foreground">
                              {index + 1}.
                            </span>
                            <div className="flex-1 space-y-2">
                              <Input
                                value={pergunta.pergunta}
                                onChange={(e) => {
                                  const updated = formularios.map(f =>
                                    f.id === form.id
                                      ? {
                                          ...f,
                                          perguntas: f.perguntas.map(p =>
                                            p.id === pergunta.id
                                              ? { ...p, pergunta: e.target.value }
                                              : p
                                          )
                                        }
                                      : f
                                  );
                                  updateFormularios(updated);
                                }}
                              />
                              <div className="flex items-center gap-4 text-sm">
                                <select
                                  value={pergunta.tipo}
                                  className="p-1 border rounded bg-background"
                                  onChange={(e) => {
                                    const updated = formularios.map(f =>
                                      f.id === form.id
                                        ? {
                                            ...f,
                                            perguntas: f.perguntas.map(p =>
                                              p.id === pergunta.id
                                                ? { ...p, tipo: e.target.value as any }
                                                : p
                                            )
                                          }
                                        : f
                                    );
                                    updateFormularios(updated);
                                  }}
                                >
                                  <option value="texto">Texto</option>
                                  <option value="numero">Número</option>
                                  <option value="escala">Escala 0-10</option>
                                  <option value="multipla">Múltipla Escolha</option>
                                </select>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={pergunta.obrigatoria}
                                    onChange={(e) => {
                                      const updated = formularios.map(f =>
                                        f.id === form.id
                                          ? {
                                              ...f,
                                              perguntas: f.perguntas.map(p =>
                                                p.id === pergunta.id
                                                  ? { ...p, obrigatoria: e.target.checked }
                                                  : p
                                              )
                                            }
                                          : f
                                      );
                                      updateFormularios(updated);
                                    }}
                                  />
                                  <span className="text-muted-foreground">Obrigatória</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setFormularioEditando(null)}
                      >
                        Salvar Alterações
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormularioEditando(form.id)}
                      >
                        Editar Perguntas
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = formularios.map(f =>
                            f.id === form.id ? { ...f, ativo: !f.ativo } : f
                          );
                          updateFormularios(updated);
                        }}
                      >
                        {form.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Informações */}
      <Card>
        <CardHeader>
          <CardTitle>Como usar os formulários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Crie um formulário com as perguntas desejadas</p>
          <p>2. Copie o link do formulário ou envie diretamente via WhatsApp</p>
          <p>3. O paciente receberá o link e poderá preencher antes da consulta</p>
          <p>4. As respostas ficarão disponíveis no prontuário do paciente</p>
          <p className="text-xs mt-4 pt-4 border-t">
            💡 Dica: Envie o formulário 24h antes da consulta para otimizar o atendimento
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
