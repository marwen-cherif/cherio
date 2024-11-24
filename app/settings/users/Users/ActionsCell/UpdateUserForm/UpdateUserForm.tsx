import React, { FC } from 'react';
import { Select } from '../../../../../../components/ui/Select/Select';
import { Input } from '../../../../../../components/ui/Input/Input';
import { Button } from 'flowbite-react';
import { Role } from '../../../../../../prisma/generated/client';
import { HiddenInput } from '../../../../../../components/ui/HiddenInput/HiddenInput';
import { useUpdateUserForm } from './UpdateUserForm.hooks';
import { StaffMember } from '../../../../../../types/StaffMember';
import { Form } from '../../../../../../components/ui/Form/Form';

interface AddUserFormProps {
  onClose: () => void;
  staffMember: StaffMember;
}

export const UpdateUserForm: FC<AddUserFormProps> = ({
  onClose,
  staffMember,
}) => {
  const { formContext, handleSubmitNewUser } = useUpdateUserForm({
    onClose,
    staffMember,
  });
  const {
    register,
    formState: { isSubmitting, errors },
  } = formContext;

  return (
    <Form onSubmit={handleSubmitNewUser}>
      <HiddenInput {...register('id')} />
      <Select
        name="role"
        options={[
          { value: '', label: 'Select role' },
          { value: Role.ADMIN, label: 'Admin' },
          { value: Role.DOCTOR, label: 'Doctor' },
          { value: Role.LEAD_DOCTOR, label: 'Lead doctor' },
        ]}
        label="Role"
        isRequired
        control={formContext.control}
      />
      <div className="flex gap-4 w-full">
        <Input
          {...register('firstName')}
          label="First name"
          isRequired
          errors={errors}
        />
        <Input
          {...register('lastName')}
          label="Last name"
          isRequired
          errors={errors}
        />
      </div>
      <Input {...register('email')} label="Email" isRequired errors={errors} />
      <Input {...register('phone')} label="Phone" isRequired errors={errors} />

      <div className="flex justify-end">
        <Button color="dark" type="submit" isProcessing={isSubmitting}>
          Submit
        </Button>
      </div>
    </Form>
  );
};
