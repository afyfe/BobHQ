-- BobHQ default tenant seed.
-- Safe to rerun: inserts Northwind Legal only when dbo.Tenants is empty.
-- Run after 001_initial_bobhq_schema.sql.

IF NOT EXISTS (SELECT 1 FROM dbo.Tenants)
BEGIN
    INSERT INTO dbo.Tenants (
        TenantId,
        Name,
        PlanName,
        Status,
        UserCount,
        ConnectorCount,
        DocumentsIndexed,
        LastActivityUtc,
        CreatedUtc,
        UpdatedUtc)
    VALUES (
        '44444444-4444-4444-4444-444444444444',
        'Northwind Legal',
        'Internal Preview',
        'Active',
        0,
        0,
        0,
        NULL,
        sysutcdatetime(),
        sysutcdatetime());
END;
