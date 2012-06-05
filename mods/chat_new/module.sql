# sql file for chat_new module

CREATE TABLE `chat_new` (
   `chat_new_id` mediumint(8) unsigned NOT NULL,
   `course_id` mediumint(8) unsigned NOT NULL,
   `value` VARCHAR( 30 ) NOT NULL ,
   PRIMARY KEY ( `chat_new_id` )
);

INSERT INTO `language_text` VALUES ('en', '_module','chat_new','Chat New',NOW(),'');
INSERT INTO `language_text` VALUES ('en', '_module','chat_new_text','New chat for ATutor.',NOW(),'');