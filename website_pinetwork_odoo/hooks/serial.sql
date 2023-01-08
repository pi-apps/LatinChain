alter table pi_transactions alter id type bigint;
alter table admin_apps alter id type bigint;
alter table pi_users alter id type bigint;
alter sequence pi_transactions_id_seq as bigint;
alter sequence admin_apps_id_seq as bigint;
alter sequence pi_users_id_seq as bigint;

/*
SELECT setval('pi_transactions_id_seq', (SELECT max(id) FROM pi_transactions));
UPDATE pi_transactions SET id=DEFAULT;
ALTER SEQUENCE pi_transactions_id_seq RESTART;
UPDATE pi_transactions SET id=DEFAULT;
*/
