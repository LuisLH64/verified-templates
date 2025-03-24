import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, FormLayout, Grid, GridColumn, GridItemModel, HorizontalLayout, Icon, TextField, VerticalLayout } from '@vaadin/react-components';
import { formResponsive } from 'Frontend/static/utils/form-responsive';
import DatePickerI18n from 'Frontend/static/components/DatePickerIl18n';
import { useState, useRef } from 'react';
import Student from 'Frontend/generated/com/verified/template/modules/student/Student';
import { importStudentsFromCSV, isValidCSVFile } from 'Frontend/static/ts/create/csv-importer';
import { useDialog } from 'Frontend/static/utils/dialog-utils';

export const config: ViewConfig = {
  menu: { order: 2, icon: 'line-awesome/svg/file-invoice-solid.svg' },
  title: 'Criar Folhas-Respostas',
};

export default function CreateSheetView() {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [inscriptionNumber, setInscriptionNumber] = useState('');
  const [date, setDate] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { showDialog, showConfirm } = useDialog();

  function addStudent(){
    if (!name || !grade) {
      showDialog('Por favor, preencha pelo menos Nome e Ano/Série.', { type: 'warning' });
      return;
    }
    
    const newStudent: Student = { 
      name, 
      grade, 
      inscriptionName: inscriptionNumber, 
      date: date 
    };
    setStudents([...students, newStudent]);
    
    setName('');
    setGrade('');
    setInscriptionNumber('');
    setDate('');
  }

  function removeStudent(index: number) {
    const updatedStudents = [...students];
    updatedStudents.splice(index, 1);
    setStudents(updatedStudents);
  }
  
  function clearAllStudents() {
    if (students.length > 0) {
      showConfirm(
        'Tem certeza que deseja remover todos os alunos da lista?',
        () => setStudents([]),
        { title: 'Remover estudantes' }
      );
    }
  }
  
  function handleImportClick() {
    fileInputRef.current?.click();
  }
  
  async function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!isValidCSVFile(file)) {
      showDialog('O arquivo selecionado não é um CSV válido.', { type: 'error' });
      event.target.value = '';
      return;
    }
    
    try {
      setLoading(true);
      const importedStudents = await importStudentsFromCSV(file);
      
      if (importedStudents.length === 0) {
        showDialog('Nenhum estudante válido encontrado no arquivo.', { type: 'warning' });
      } 
      
      else {
        setStudents([...students, ...importedStudents]);
        showDialog(`${importedStudents.length} estudante(s) importado(s) com sucesso!`, { type: 'success' });
      }
    } 
    catch (error) {
      showDialog(`Erro ao importar CSV: ${error instanceof Error ? error.message : String(error)}`, { type: 'error' });
    } 
    finally {
      setLoading(false);
      event.target.value = '';
    }
  }

  return (
    <VerticalLayout theme="spacing" style={{ alignItems: 'stretch' }}>
      <HorizontalLayout theme="margin spacing" style={{ alignItems: 'center' }}>
        <h2 style={{ margin: '0 auto 0 0' }}>Criar Folhas-Resposta</h2>
        
        <input
          type="file"
          accept=".csv,text/csv"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelection}
        />
        
        <Button 
          theme='primary success' 
          onClick={handleImportClick}
          disabled={loading}
        >
          <Icon icon={loading ? 'vaadin:loading' : 'vaadin:paste'} />
          {loading ? 'Importando...' : 'Importar Lista'}
        </Button>
      </HorizontalLayout>

      <FormLayout responsiveSteps={formResponsive} className='p-m gap-12 items-end items-center'>
        <TextField
          id='title'
          label="Título da prova"
          data-colspan='4'
          required
        />
      </FormLayout>
    
      <FormLayout responsiveSteps={formResponsive} className='p-m gap-12 items-end items-center'>
        <TextField
          id='name'
          label="Nome do Aluno"
          data-colspan='3'
          required
          value={name}
          onValueChanged={(e) => setName(e.detail.value)}
        />

        <TextField
          id='grade'
          label="Ano/Série"
          placeholder='Ex: 1º ano A'
          required
          value={grade}
          onValueChanged={(e) => setGrade(e.detail.value)}
        />

        <TextField
          id='inscriptionNumber'
          label="Nº de inscrição"
          value={inscriptionNumber}
          onValueChanged={(e) => setInscriptionNumber(e.detail.value)}
        />

        <DatePickerI18n
          id='date'
          label='Data da prova'
          locale='br'
          onValueChanged={(e) => setDate(e.detail.value)}>
        </DatePickerI18n>

      </FormLayout>

      <HorizontalLayout theme="spacing" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button 
          theme='primary'
          onClick={() => addStudent()}
        >
          <Icon icon="vaadin:plus" />
          Adicionar
        </Button>
        
        {students.length > 0 && (
          <Button 
            theme='error'
            onClick={() => clearAllStudents()}
          >
            <Icon icon="vaadin:trash" />
            Limpar Lista
          </Button>
        )}
      </HorizontalLayout>

      <HorizontalLayout theme='margin spacing'>
        <Grid items={students} allRowsVisible>
          <GridColumn header="Nome" path="name" />
          <GridColumn header="Ano" path="grade" />
          <GridColumn header="Nº de inscrição" path="inscriptionName" />
          <GridColumn header="Data" path="date" />
          <GridColumn header="Ações" renderer={({ item, model }) => (
            <Button theme="error tertiary small" onClick={() => removeStudent(students.indexOf(item as Student))}>
              <Icon icon="vaadin:trash" />
            </Button>
          )} />

          <span slot="empty-state">Nenhum dado inserido!</span>
        </Grid>
      </HorizontalLayout>

      <HorizontalLayout theme="spacing" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button 
          theme='primary success'
        >
          <Icon icon="vaadin:check" />
          Gerar Folhas-Resposta
        </Button>
      </HorizontalLayout>
      
    </VerticalLayout>

    
  );
}
