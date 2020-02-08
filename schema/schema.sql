DROP DATABASE IF EXISTS manage_your_chill;

CREATE DATABASE manage_your_chill;

USE manage_your_chill;

DROP TABLE IF exists users;

CREATE TABLE users(
	id 				INTEGER auto_increment,
    fullName		VARCHAR(128) NOT NULL,
    companyName		VARCHAR(128),
    email			VARCHAR(128) NOT NULL,
    password		VARCHAR(256) NOT NULL,
    createdOn		VARCHAR(12)  NOT NULL,
    accountID		integer,
    primary key(id)
);

DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts(
	id   INTEGER auto_increment,
    accountOnwer    INTEGER NOT NULL,
    users			VARCHAR(256),
    chillerIDs		VARCHAR(256) NOT NULL,
    primary key(id)
);





DROP TABLE IF EXISTS chillers;

CREATE TABLE chillers(
	id			    INTEGER auto_increment,
    chillerName		VARCHAR(128) NOT NULL,
    location   	    VARCHAR(256) NOT NULL,
    ownerID		    INTEGER NOT NULL,
    accountId	    Integer,
    serial	        VARCHAR(256) NOT NULL,
    setPoint        VARCHAR(32),
    overAlarm       VARCHAR(32),
    underAlarm      VARCHAR(32),
    firstStartTime  INTEGER,
    lastStartTime   INTEGER,
    totalRunTime    INTEGER,
    running			boolean,
    statusMsg		VARCHAR(256),
    primary key     (id)
    );

DROP TABLE IF EXISTS chillerData;
CREATE TABLE chillerData(
	id						INTEGER auto_increment,
    chillerID				INTEGER NOT NULL,
    temp1 					float NOT NULL,
    temp2					float NOT NULL,
    temp3					float NOT NULL,
    ambientTemp				float NOT NULL,
    humidity				float NOT NULL,
    timestamp				INTEGER NOT NULL,
    primary key(id)
);
