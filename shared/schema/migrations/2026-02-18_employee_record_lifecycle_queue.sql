CREATE TABLE IF NOT EXISTS `employee_record_lifecycle_queue` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `employee_number` INT NOT NULL,
    `requested_action` ENUM('archive', 'delete') NOT NULL DEFAULT 'archive',
    `reason` VARCHAR(255) NOT NULL,
    `status` ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `queued_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `processed_at` DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_employee_action_status` (`employee_number`, `requested_action`, `status`),
    KEY `idx_status_queued_at` (`status`, `queued_at`),
    CONSTRAINT `fk_lifecycle_employee`
        FOREIGN KEY (`employee_number`) REFERENCES `employees_table`(`employee_number`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
