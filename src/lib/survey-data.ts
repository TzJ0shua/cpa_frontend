import type { Curso, Respostas } from './survey-types'

export const cursos: Curso[] = [
  {
    id: 'sistemas-informacao',
    nome: 'Sistemas de Informação',
    materias: [
      { id: 'algoritmos', nome: 'Algoritmos e Programação' },
      { id: 'banco-dados', nome: 'Banco de Dados' },
      { id: 'engenharia-software', nome: 'Engenharia de Software' },
      { id: 'redes', nome: 'Redes de Computadores' },
      { id: 'ia', nome: 'Inteligência Artificial' },
    ],
  },
  {
    id: 'administracao',
    nome: 'Administração',
    materias: [
      { id: 'marketing', nome: 'Marketing' },
      { id: 'financas', nome: 'Finanças Empresariais' },
      { id: 'gestao', nome: 'Gestão de Pessoas' },
    ],
  },
  {
    id: 'direito',
    nome: 'Direito',
    materias: [
      { id: 'civil', nome: 'Direito Civil' },
      { id: 'penal', nome: 'Direito Penal' },
      { id: 'constitucional', nome: 'Direito Constitucional' },
    ],
  },
]

export const perguntas = [
  { id: 'didaticaProfessor', texto: 'Como você avalia a didática do professor?' },
  {
    id: 'organizacaoDisciplina',
    texto: 'Como você avalia a organização da disciplina?',
  },
  { id: 'clarezaConteudo', texto: 'O conteúdo foi apresentado de forma clara?' },
  { id: 'quantidadeAtividades', texto: 'A quantidade de atividades foi adequada?' },
  { id: 'tirarDuvidas', texto: 'Você conseguiu tirar dúvidas adequadamente?' },
  { id: 'materialDisponibilizado', texto: 'Como avalia os materiais disponibilizados?' },
] as const

export const defaultRespostas: Respostas = {
  didaticaProfessor: 0,
  organizacaoDisciplina: 0,
  clarezaConteudo: 0,
  quantidadeAtividades: 0,
  tirarDuvidas: 0,
  materialDisponibilizado: 0,
  comentario: '',
}
