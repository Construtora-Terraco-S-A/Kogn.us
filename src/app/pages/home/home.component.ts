import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [
    ButtonModule, 
    CommonModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  // Lista de steps com icone e cor dele, titulo e descrição
  steps = [{
    icon: "pi pi-cloud-upload",
    title: '1. Faça o Upload',
    description: 'Envie seus arquivos de estudo, como PDFs, anotações de aula ou artigos.',
    color: 'text-blue-400'
  }, {
    icon: "pi pi-objects-column",
    title: '2. Escolha o Formato',
    description: 'Selecione o tipo de material que deseja criar: resumos, quizzes, mapas mentais e mais.',
    color: 'text-pink-400'
  }, {
    icon: "pi pi-sparkles",
    title: '3. Receba a Mágica',
    description: 'Em segundos, a IA gera um conteúdo personalizado e confiável, pronto para turbinar seus estudos.',
    color: 'text-purple-400'
  }];

  // Lista de funcionalidades com icone, titulo e descrição
  features = [
    { 
      icon: "pi pi-shield",
      title: 'Seus Dados, Seu Controle',
      description: 'Gere conteúdo com segurança, usando apenas seus próprios documentos. Privacidade em primeiro lugar.' 
    },
    { 
      icon: "pi pi-sparkles",
      title: 'Geração de Conteúdo Versátil',
      description: 'Crie resumos, quizzes, mapas mentais, e mais a partir de suas fontes com um clique.' 
    },
    { 
      icon: "pi pi-book",
      title: 'Organização em Cadernos',
      description: 'Mantenha seus materiais de estudo, fontes e conteúdos gerados organizados por disciplina.' 
    },
    { 
      icon: "pi pi-chart-bar",
      title: 'Acompanhamento de Desempenho',
      description: 'Monitore suas notas, defina metas e receba análises da IA para otimizar seus estudos.' 
    }
  ];
}
