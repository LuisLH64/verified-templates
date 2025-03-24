import Student from 'Frontend/generated/com/verified/template/modules/student/Student';

/**
 * Função para importar estudantes a partir de um arquivo CSV
 * @param file - O arquivo CSV a ser importado
 * @returns Uma promessa que resolve para um array de Student
 */
export async function importStudentsFromCSV(file: File): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvContent = event.target?.result as string;
        if (!csvContent) {
          reject(new Error('Falha ao ler o arquivo'));
          return;
        }
        
        // Dividir o conteúdo em linhas e remover linhas vazias
        const lines = csvContent.split('\n').filter(line => line.trim() !== '');
        
        // Verificar se há pelo menos uma linha (cabeçalho)
        if (lines.length < 2) {
          reject(new Error('O arquivo CSV não contém dados válidos'));
          return;
        }
        
        // A primeira linha é o cabeçalho
        const header = lines[0].split(',').map(col => col.trim());
        
        // Índices das colunas (caso a ordem das colunas não seja fixa)
        const nameIndex = header.findIndex(col => 
          col.toLowerCase().includes('nome') || col.toLowerCase() === 'name');
        const gradeIndex = header.findIndex(col => 
          col.toLowerCase().includes('ano') || col.toLowerCase().includes('série') || 
          col.toLowerCase() === 'grade');
        const inscriptionIndex = header.findIndex(col => 
          col.toLowerCase().includes('inscrição') || col.toLowerCase().includes('inscription'));
        const dateIndex = header.findIndex(col => 
          col.toLowerCase().includes('data') || col.toLowerCase() === 'date');
        
        // Verificar se encontrou as colunas necessárias
        if (nameIndex === -1 || gradeIndex === -1) {
          reject(new Error('O arquivo CSV não contém as colunas obrigatórias (Nome e Ano/Série)'));
          return;
        }
        
        // Processar as linhas de dados (excluindo o cabeçalho)
        const students: Student[] = [];
        for (let i = 1; i < lines.length; i++) {
          // Lidar com vírgulas dentro de aspas (ex: "Silva, João")
          const columns = parseCSVLine(lines[i]);
          
          // Verificar se a linha tem colunas suficientes
          if (columns.length <= Math.max(nameIndex, gradeIndex)) {
            continue; // Pular linhas inválidas
          }
          
          // Criar um novo estudante
          const student: Student = {
            name: columns[nameIndex] || '',
            grade: columns[gradeIndex] || '',
            inscriptionName: inscriptionIndex !== -1 ? columns[inscriptionIndex] || '' : '',
            date: dateIndex !== -1 ? columns[dateIndex] || '' : '',
          };
          
          // Adicionar apenas se tiver pelo menos nome e série
          if (student.name && student.grade) {
            students.push(student);
          }
        }
        
        resolve(students);
      } catch (error) {
        reject(new Error(`Erro ao processar o arquivo CSV: ${error instanceof Error ? error.message : String(error)}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo'));
    };
    
    // Iniciar a leitura do arquivo como texto
    reader.readAsText(file);
  });
}

/**
 * Função auxiliar para analisar uma linha CSV respeitando aspas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let currentValue = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      result.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Adicionar o último valor
  result.push(currentValue.trim());
  
  return result;
}

/**
 * Função para validar se o arquivo é um CSV válido
 */
export function isValidCSVFile(file: File): boolean {
  // Verificar a extensão do arquivo
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension === 'csv' || file.type === 'text/csv';
} 