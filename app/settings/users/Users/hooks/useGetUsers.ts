'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Service } from '@/app/helpers/ApiClient/Service';

export const GET_USERS = 'getUsers';

export const useGetUsers = () => {
  const { data: users } = useQuery({
    initialData: [],
    queryKey: [GET_USERS],
    queryFn: async () => {
      return Service.getUsers();
    },
    placeholderData: keepPreviousData,
  });

  return {
    users,
  };
};