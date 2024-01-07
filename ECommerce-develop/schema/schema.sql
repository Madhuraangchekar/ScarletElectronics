SET SQL_MODE='ALLOW_INVALID_DATES';
SET storage_engine=INNODB;


use scarletelectronics;

drop table if EXISTS order_detail;
drop table if EXISTS delivery_info;
drop table if EXISTS purchase;



create table purchase(
	purchaseId int NOT NULL auto_increment Primary key,
    purchase_date timestamp NOT NULL,
    paymentId varchar(50) NOT NULL,
    total_price float NOT NULL,
    userId  int unsigned NOT NULL,
    FOREIGN KEY (`userId`) REFERENCES `end_user` (`userId`)
);

/* DeliveryInfo table stores the delivery details per purchase*/
-- create table delivery_info(
-- 	deliveryId int NOT NULL auto_increment Primary key,
--     purchaseId int NOT NULL,
--     estimated_delivery_date timestamp,
--     actual_delivery_date timestamp,
-- 	delivery_address_line1 varchar(50) DEFAULT NULL,
--     delivery_address_line2 varchar(50) DEFAULT NULL,
--     delivery_address_city varchar(50) DEFAULT NULL,
--     delivery_address_state_code varchar(2) DEFAULT NULL,
--     delivery_address_zipcode varchar(6) DEFAULT NULL,
--     FOREIGN KEY (`purchaseId`) REFERENCES `purchase` (`purchaseId`)
-- );

/* OrderDetail table stores the items ordered per purchase*/
create table order_detail(
	orderId int NOT NULL auto_increment PRIMARY KEY,
    listingId int NOT NULL,
    purchaseId int NOT NULL,
    shipmentId varchar(50) NOT NULL,
    trackingId varchar(50),
    quantity int NOT NULL,
    total_cost_of_item float NOT NULL,
    return_status varchar(50) DEFAULT NULL,
    FOREIGN KEY (`listingId`) REFERENCES `item_listing`(`listingId`) ON DELETE CASCADE
);

