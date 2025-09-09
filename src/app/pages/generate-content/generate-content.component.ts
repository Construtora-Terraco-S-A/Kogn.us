import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-generate-content',
  imports: [
    CommonModule
  ],
  templateUrl: './generate-content.html',
  styleUrl: './generate-content.scss'
})
export class GenerateContent {

  contentTypes = [
    { 
      id: 'research',
      name: 'Relatório de Pesquisa',
      icon: "pi pi-file-edit",
      color: 'from-blue-500 to-cyan-500',
      description: 'Relatórios detalhados com citações automáticas.'
    },
    { id: 'review-podcast',
      name: 'Podcast de Revisão',
      icon: "pi pi-headphones",
      color: 'from-purple-500 to-pink-500',
      description: 'Podcasts curtos para revisar os pontos-chave.'
    },
    { id: 'quiz',
      name: 'Testes/Quizzes',
      icon: "pi pi-file-plus",
      color: 'from-orange-500 to-red-500',
      description: 'Testes personalizados baseados no conteúdo.'
    },
    { id: 'study',
      name: 'Guia de Estudo',
      icon: "pi pi-book",
      color: 'from-teal-500 to-blue-500',
      description: 'Guias estruturados para estudo eficiente.'
    },
    { id: 'slides',
      name: 'Apresentação Interativa',
      icon: "pi pi-sliders-h",
      color: 'from-rose-500 to-fuchsia-500',
      description: 'Crie slides interativos para suas apresentações.'
    },
    { id: 'mindmap',
      name: 'Mapa Mental',
      icon: "pi pi-map",
      color: 'from-pink-500 to-rose-500',
      description: 'Organize ideias e conceitos visualmente.'
    },
    { id: 'summaryboard',
      name: 'Quadro-Resumo',
      icon: "pi pi-save",
      color: 'from-amber-500 to-yellow-500',
      description: 'Quadros sintéticos com os pontos-chave.'
    },
    { id: 'flashcards',
      name: 'Flash Cards',
      icon: "pi pi-clipboard",
      color: 'from-lime-500 to-green-500',
      description: 'Cartões de estudo para memorização rápida.'
    },
  ];
}
