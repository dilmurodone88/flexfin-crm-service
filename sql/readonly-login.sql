-- ESLATMA: bu skriptni FAQAT o'zingiz ko'rib chiqib, ishga tushirasiz (servis uni hech qachon bajarmaydi).
-- Maqsad: servis uchun faqat-o'qiydigan login (baza darajasidagi himoya). Bazaga yozish imkonsiz bo'ladi.
-- sqlcmd -S localhost -v RO_PASSWORD="<kuchli parol>" -i sql/readonly-login.sql
USE [master];
CREATE LOGIN [flexfin_crm_ro] WITH PASSWORD = N'$(RO_PASSWORD)', CHECK_POLICY = ON, DEFAULT_DATABASE = [FlexFin];
GO
USE [FlexFin];
CREATE USER [flexfin_crm_ro] FOR LOGIN [flexfin_crm_ro];
ALTER ROLE [db_datareader] ADD MEMBER [flexfin_crm_ro];   -- faqat SELECT
-- Parol/hash ustunlarini baza darajasida ham yopish (tavsiya). Servis maxfiy ustunlarni so'rovdan
-- chiqarib tashlaydi (Prisma `omit`), shuning uchun DENY /v1/isUser ni buzmaydi:
DENY SELECT ON OBJECT::[dbo].[isUser]([Password], [PasswordSalt]) TO [flexfin_crm_ro];
GO
