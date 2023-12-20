CREATE TABLE IF NOT EXISTS public.users
(
    name VARCHAR(55)  NOT NULL,
    prn bigint NOT NULL DEFAULT,
    password VARCHAR(250) NOT NULL,
    createdat timestamp without time zone,
    CONSTRAINT users_pkey PRIMARY KEY (prn)
)