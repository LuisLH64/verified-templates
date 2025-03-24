// function exportToCSV() {
  //   if (students.length === 0) {
  //     alert('Não há alunos para exportar.');
  //     return;
  //   }
    
  //   // Criar cabeçalho e linhas do CSV
  //   const headers = ['Nome', 'Ano/Série', 'Número de Inscrição', 'Data'];
  //   const csvContent = [
  //     headers.join(','),
  //     ...students.map(student => 
  //       [
  //         student.name, 
  //         student.grade, 
  //         student.inscriptionName, 
  //         student.date
  //       ].join(',')
  //     )
  //   ].join('\n');
    
  //   // Criar blob e link para download
  //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.setAttribute('href', url);
  //   link.setAttribute('download', `lista_alunos_${new Date().toISOString().split('T')[0]}.csv`);
  //   link.style.visibility = 'hidden';
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }