INSERT INTO Payment (id, userId, proofImage, status, createdAt)
VALUES ('pay1', 'cmnxlwxlz0000s79oa3mosc1x', 'proof.png', 'approved', CURRENT_TIMESTAMP);

INSERT INTO Subscription (id, userId, plan, startDate, active)
VALUES ('sub1', 'cmnxlwxlz0000s79oa3mosc1x', 'Resume AI', CURRENT_TIMESTAMP, 1);