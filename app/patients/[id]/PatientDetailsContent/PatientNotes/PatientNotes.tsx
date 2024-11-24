import React, { FC } from 'react';
import { useTranslations } from 'next-intl';
import { Table } from '../../../../../components/ui/Table/Table';
import { ColumnDef } from '@tanstack/react-table';
import { Note } from '../../../../../types/PatientDetails';
import { FilesCell } from './FilesCell/FilesCell';
import { usePatientNotes } from './PatientNotes.hooks';

interface Props {
  patientId: string;
}

export const PatientNotes: FC<Props> = ({ patientId }) => {
  const notesMessages = useTranslations('patients.patient.notes');
  const { notes } = usePatientNotes({ patientId });

  const columns = React.useMemo<ColumnDef<Note>[]>(
    () => [
      {
        accessorKey: 'content',
        header: () => notesMessages('content'),
        footer: (props) => props.column.id,
      },
      {
        header: notesMessages('files'),
        cell: (props) => <FilesCell files={props.row.original.files} />,
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  return (
    <>
      <Table data={notes} columns={columns} />
    </>
  );
};
