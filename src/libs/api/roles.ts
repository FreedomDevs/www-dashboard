export type PermissionRegistry = Record<string, Record<string, string>>;

export const roles: PermissionRegistry = {
  'svc-users': {
    search: 'Получение всехпользователей',
    read_self: 'Чтение информации по самому себе',
    read: 'Чтение информации по конкретному пользователю',
    read_password: 'Чтение хешей паролей пользователей',
    create: 'Создание новых пользователей',
    delete: 'Удаление пользователей',
    groups_list: 'Получение списка групп',
    groups_create: 'Создание групп',
    groups_delete: 'Удаление групп',
    edit: 'Редактирование прав пользователя',
  },

  'svc-dox': {
    ip: 'Докс по IP',
  },

  'svc-auth': {
    pop_game_token: 'Проверка game token-ов',
    edit_client_info: 'Создание, редактирование, удаление client_info',
  },

  'svc-whitelist': {
    add: 'Добавление игроков в whitelist',
    check: 'Проверка на наличие игрока в whitelist',
    delete: 'Удаление игрока из whitelist',
  },

  'svc-queue': {
    subscribe: 'Подписка на очереди',
    publish: 'Публикация данных',
  },
  dashboard: {
    admin: 'Админ типо',
    moder: 'Жосткий модер',
  },
};
