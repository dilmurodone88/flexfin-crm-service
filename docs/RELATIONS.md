# Modellar va bog'lanishlar (har model bo'yicha)

> Avtomatik: `node scripts/build-relations.mjs` (manba: `schema-dump.txt`). Model nomi: `dbo` jadvallari o'z nomi bilan, boshqa schema'larda dublikat bo'lsa `Schema_Jadval`.
>
> Har model uchun: **ota bog'lanishlar** (`?expand=Ustun`, `/graph`) va **bolalar** (`/{id}/{Bola}?by=Ustun`). Composite/noaniq FK'lar (0 ta) o'tkazib yuborilgan.

## Fihrist

| Model | Qator | PK | Ota | Bola |
|---|--:|---|--:|--:|
| [Affiliation_Relation](#affiliation_relation) | 0 | OID | 5 | 0 |
| [Affiliation_RelationGroupType](#affiliation_relationgrouptype) | 2 | OID | 1 | 1 |
| [Affiliation_RelationHistory](#affiliation_relationhistory) | 0 | OID | 6 | 0 |
| [Affiliation_RelationType](#affiliation_relationtype) | 19 | OID | 2 | 2 |
| [CBReport_ChartOfAccounts](#cbreport_chartofaccounts) | 557 | yo'q (raw) | 0 | 0 |
| [CBReport_FieldValue](#cbreport_fieldvalue) | 60 | yo'q (raw) | 0 | 0 |
| [CBReport_LoanPortfolio](#cbreport_loanportfolio) | 0 | yo'q (raw) | 0 | 0 |
| [CBReport_LoanPortfolioLiquidityPrincipalPayment](#cbreport_loanportfolioliquidityprincipalpayment) | 85 694 | yo'q (raw) | 0 | 0 |
| [CBReport_LoanStatisticsByType](#cbreport_loanstatisticsbytype) | 204 | yo'q (raw) | 0 | 0 |
| [CBReport_TurnoverAndBalanceSheet](#cbreport_turnoverandbalancesheet) | 1 444 | yo'q (raw) | 0 | 0 |
| [CLRUtil_SubstitutionRule](#clrutil_substitutionrule) | 172 | RuleId, KeyString | 0 | 0 |
| [CLRUtil_SubstitutionRuleType](#clrutil_substitutionruletype) | 3 | Id | 0 | 0 |
| [CdcCore_ChangedEntity](#cdccore_changedentity) | 14 014 | yo'q (raw) | 0 | 0 |
| [CdcCore_Configuration](#cdccore_configuration) | 1 | yo'q (raw) | 0 | 0 |
| [CdcCore_HealthCheck](#cdccore_healthcheck) | 1 | LastCheckTime | 0 | 0 |
| [CdcCore_Projects](#cdccore_projects) | 16 | ProjectName | 0 | 0 |
| [CdcCore_Session](#cdccore_session) | 1 | yo'q (raw) | 0 | 0 |
| [CloseOperDay_ExecutionProcessState](#closeoperday_executionprocessstate) | 1 | OID | 1 | 0 |
| [CloseOperDay_ExecutionProcessStateLog](#closeoperday_executionprocessstatelog) | 20 240 | OID | 0 | 0 |
| [CollateralRegistry_SchemaVersions](#collateralregistry_schemaversions) | 43 | Id | 0 | 0 |
| [Crif_SchemaVersions](#crif_schemaversions) | 7 | Id | 0 | 0 |
| [DCR_AccountCodeMapping](#dcr_accountcodemapping) | 10 | Code, Priority | 0 | 0 |
| [DCR_Channel](#dcr_channel) | 13 | Id | 0 | 0 |
| [DCR_FinObjectTypeAccountMapping](#dcr_finobjecttypeaccountmapping) | 15 | IsBalanceAccount, FinObjectTypeAccountOID, AccountQualifier | 0 | 0 |
| [DCR_ReplicationSession](#dcr_replicationsession) | 1 | Id | 0 | 0 |
| [DCR_SchemaVersions](#dcr_schemaversions) | 75 | Id | 0 | 0 |
| [DCR_TmpChangedEntity](#dcr_tmpchangedentity) | 0 | EntityId, EntityType | 0 | 0 |
| [DCR_TmpLoanOperationBatch](#dcr_tmploanoperationbatch) | 0 | yo'q (raw) | 0 | 0 |
| [DCR_TmpLoanScheduleBatch](#dcr_tmploanschedulebatch) | 0 | yo'q (raw) | 0 | 0 |
| [DebtCollector_ClientBinding](#debtcollector_clientbinding) | 275 | ClientPublicId | 0 | 0 |
| [DebtCollector_SchemaVersions](#debtcollector_schemaversions) | 29 | Id | 0 | 0 |
| [FlexFinApi_AccountCodeMapping](#flexfinapi_accountcodemapping) | 9 | Code, Priority | 0 | 0 |
| [FlexFinApi_Channel](#flexfinapi_channel) | 12 | yo'q (raw) | 0 | 0 |
| [FlexFinApi_FinObjectTypeAccountMapping](#flexfinapi_finobjecttypeaccountmapping) | 15 | IsBalanceAccount, FinObjectTypeAccountOID, AccountQualifier | 0 | 0 |
| [FlexFinApi_LastExportedDocumentStateOID](#flexfinapi_lastexporteddocumentstateoid) | 1 | DocumentStateOID | 0 | 0 |
| [FlexFinApi_LoanApplicationEarlyRejected](#flexfinapi_loanapplicationearlyrejected) | 89 | LoanApplicationPublicId | 0 | 0 |
| [FlexFinApi_LoanCollateralsWithInsertedOffbalanceOperations](#flexfinapi_loancollateralswithinsertedoffbalanceoperations) | 10 123 | LoanCollateralOid | 1 | 0 |
| [FlexFinApi_OperationCache](#flexfinapi_operationcache) | 272 874 | LoanOID, OperationOID, Date, Amount, Account | 0 | 0 |
| [FlexFinApi_SchemaVersions](#flexfinapi_schemaversions) | 375 | Id | 0 | 0 |
| [Grki_FinObjectChangeQueue](#grki_finobjectchangequeue) | 0 | FinObjectId | 0 | 0 |
| [Grki_FinObjectTypeAccountMapping](#grki_finobjecttypeaccountmapping) | 28 | IsBalanceAccount, FinObjectTypeAccountOID, AccountQualifier, IsLmb | 0 | 0 |
| [Grki_InitialOperDay](#grki_initialoperday) | 1 | OperDay | 0 | 0 |
| [Grki_LoanApplicationGrkiRegistartionNumber](#grki_loanapplicationgrkiregistartionnumber) | 12 500 | GrkiIdentifier | 2 | 0 |
| [Grki_SchemaVersions](#grki_schemaversions) | 349 | Id | 0 | 0 |
| [Legalisation_BlackListCheckReport](#legalisation_blacklistcheckreport) | 38 | ID | 1 | 0 |
| [Legalisation_BlackListCheckReportTask](#legalisation_blacklistcheckreporttask) | 5 | ID | 0 | 1 |
| [LegalizationUpdater_LetterOption](#legalizationupdater_letteroption) | 327 | yo'q (raw) | 0 | 0 |
| [LegalizationUpdater_ListCodeReference](#legalizationupdater_listcodereference) | 6 | ListCode | 0 | 0 |
| [LegalizationUpdater_SchemaVersions](#legalizationupdater_schemaversions) | 13 | Id | 0 | 0 |
| [LegalizationUpdater_UpdaterFailsHistory](#legalizationupdater_updaterfailshistory) | 1 | MessageId | 0 | 0 |
| [PMT_CanceledDisbursement](#pmt_canceleddisbursement) | 0 | yo'q (raw) | 1 | 0 |
| [PMT_CanceledDisbursementTransaction](#pmt_canceleddisbursementtransaction) | 0 | Id | 0 | 0 |
| [PMT_Disbursement](#pmt_disbursement) | 67 | yo'q (raw) | 2 | 0 |
| [PMT_DisbursementTransaction](#pmt_disbursementtransaction) | 67 | Id | 0 | 0 |
| [PMT_PaymentTransaction](#pmt_paymenttransaction) | 73 776 | PaymentSystem, ExternalId | 0 | 0 |
| [PMT_SchemaVersions](#pmt_schemaversions) | 28 | Id | 0 | 0 |
| [Report_DataSource](#report_datasource) | 4 | Id | 0 | 0 |
| [Report_FinObjectMetaData](#report_finobjectmetadata) | 4 | yo'q (raw) | 0 | 0 |
| [Report_ItemType](#report_itemtype) | 2 | Id | 0 | 1 |
| [Report_Package](#report_package) | 2 | Id | 0 | 0 |
| [Report_ReportItem](#report_reportitem) | 8 | Id | 2 | 1 |
| [Report_ReportLayout](#report_reportlayout) | 4 | Id | 0 | 0 |
| [ReportGenerator_DataSource](#reportgenerator_datasource) | 1 | Id | 0 | 3 |
| [ReportGenerator_FileType](#reportgenerator_filetype) | 2 | Id | 0 | 1 |
| [ReportGenerator_RegistryFile](#reportgenerator_registryfile) | 8 | Id | 3 | 1 |
| [ReportGenerator_RegistryFileContent](#reportgenerator_registryfilecontent) | 8 | Id | 1 | 0 |
| [ReportGenerator_RegistryItem](#reportgenerator_registryitem) | 11 | Id | 1 | 2 |
| [ReportGenerator_ReportBinding](#reportgenerator_reportbinding) | 8 | PackageId, FileId | 2 | 0 |
| [ReportGenerator_ReportPackage](#reportgenerator_reportpackage) | 1 | Id | 1 | 0 |
| [ReportGenerator_SampleData](#reportgenerator_sampledata) | 1 | Id | 1 | 0 |
| [ReportGenerator_SchemaVersions](#reportgenerator_schemaversions) | 58 | Id | 0 | 0 |
| [ASOKIClientType](#asokiclienttype) | 14 | OID | 1 | 2 |
| [ASOKICollateralStatus_A13Reference](#asokicollateralstatus_a13reference) | 3 | OID | 1 | 0 |
| [ASOKIDepositType](#asokideposittype) | 2 | OID | 1 | 1 |
| [ASOKIIgnoreList](#asokiignorelist) | 0 | OID | 0 | 0 |
| [ASOKILoanApplicationParticipantStatus_A19Reference](#asokiloanapplicationparticipantstatus_a19reference) | 2 | OID | 1 | 0 |
| [ASOKILoanApplicationParticipantType_A18Reference](#asokiloanapplicationparticipanttype_a18reference) | 4 | OID | 1 | 1 |
| [AccountCodeFormula](#accountcodeformula) | 2 | OID | 1 | 1 |
| [AccountCodeFormulaSettings](#accountcodeformulasettings) | 1 | OID | 2 | 0 |
| [AccountLogicalGroup](#accountlogicalgroup) | 0 | OID | 1 | 1 |
| [AccountNumerator](#accountnumerator) | 0 | BalanceAccountCode, Client | 1 | 0 |
| [AccountQualifierAsFinObject](#accountqualifierasfinobject) | 37 251 | OID | 2 | 0 |
| [AccountQualifierType](#accountqualifiertype) | 15 | OID | 1 | 3 |
| [AffiliationType](#affiliationtype) | 5 | OID | 1 | 1 |
| [ApplicationData](#applicationdata) | 1 | OID | 2 | 0 |
| [ApplicationEntry](#applicationentry) | 196 | ApplicationName, RelativePathName | 0 | 0 |
| [BackupDatabaseErrorLog](#backupdatabaseerrorlog) | 40 | OID | 1 | 0 |
| [BackupDatabaseLog](#backupdatabaselog) | 2 958 | OID | 1 | 1 |
| [BackupDatabaseSettings](#backupdatabasesettings) | 1 | OID | 0 | 0 |
| [BalanceAccount](#balanceaccount) | 688 | OID | 4 | 2 |
| [BalanceAccountBalanceAccounts_AccountLogicalGroupLogicalGroups](#balanceaccountbalanceaccounts_accountlogicalgrouplogicalgroups) | 0 | OID | 0 | 0 |
| [BalanceAccountToFinObjectTypeAccountBinding](#balanceaccounttofinobjecttypeaccountbinding) | 919 | OID | 2 | 0 |
| [BalanceAccountToLogicalGroupBinding](#balanceaccounttologicalgroupbinding) | 0 | OID | 2 | 0 |
| [Bank](#bank) | 63 | OID | 2 | 0 |
| [BankBranch](#bankbranch) | 1 217 | OID | 3 | 3 |
| [BaseAccount](#baseaccount) | 508 134 | OID | 4 | 6 |
| [BaseAccountQualifier](#baseaccountqualifier) | 37 287 | OID | 3 | 18 |
| [BaseClient](#baseclient) | 19 216 | OID | 15 | 20 |
| [BorrowerType](#borrowertype) | 44 | OID | 3 | 3 |
| [Branch](#branch) | 14 | OID | 1 | 6 |
| [CBReportTemplate](#cbreporttemplate) | 1 | OID | 1 | 0 |
| [CalculationMethodProviderFormula](#calculationmethodproviderformula) | 3 | OID | 1 | 1 |
| [Calendar](#calendar) | 16 437 | Date | 0 | 0 |
| [Cert](#cert) | 1 | OID | 0 | 0 |
| [ClientBankAccount](#clientbankaccount) | 1 | OID | 3 | 0 |
| [ClientBlackListItem](#clientblacklistitem) | 7 721 | OID | 1 | 0 |
| [ClientImageAttachment](#clientimageattachment) | 0 | OID | 3 | 0 |
| [ClientImageAttachmentType](#clientimageattachmenttype) | 0 | OID | 1 | 1 |
| [ClientLicense](#clientlicense) | 1 | OID | 2 | 0 |
| [ClientType](#clienttype) | 0 | OID | 1 | 2 |
| [ClientTypeClassifier](#clienttypeclassifier) | 14 | OID | 1 | 5 |
| [ClosedIndividualClientPersonalCitizenCode](#closedindividualclientpersonalcitizencode) | 29 | IndividualClientOid | 0 | 0 |
| [CollateralRegistryLegislativeClientSmallBusinessType](#collateralregistrylegislativeclientsmallbusinesstype) | 6 | OID | 1 | 1 |
| [ContactInformation](#contactinformation) | 19 325 | OID | 1 | 4 |
| [ContractTemplate](#contracttemplate) | 0 | OID | 1 | 1 |
| [Country](#country) | 251 | OID | 2 | 7 |
| [Currency](#currency) | 212 | OID | 1 | 6 |
| [CurrencyRate](#currencyrate) | 0 | OID | 2 | 0 |
| [CustomFinObject](#customfinobject) | 111 | OID | 1 | 0 |
| [CustomFinProduct](#customfinproduct) | 4 | OID | 1 | 0 |
| [Deposit](#deposit) | 0 | OID | 2 | 0 |
| [DepositProduct](#depositproduct) | 0 | OID | 2 | 0 |
| [DepositType](#deposittype) | 4 | OID | 1 | 2 |
| [DirectOrgan](#directorgan) | 439 | OID | 1 | 2 |
| [District](#district) | 230 | OID | 2 | 6 |
| [Document](#document) | 5 803 203 | OID | 9 | 2 |
| [DocumentAmountFormula](#documentamountformula) | 26 | OID | 1 | 2 |
| [DocumentDateFormula](#documentdateformula) | 8 | OID | 1 | 2 |
| [DocumentNumerationFormula](#documentnumerationformula) | 1 | OID | 1 | 0 |
| [DocumentState](#documentstate) | 6 518 524 | OID | 4 | 2 |
| [DocumentStateCategory](#documentstatecategory) | 5 | OID | 0 | 3 |
| [DocumentStateChangeAction](#documentstatechangeaction) | 4 | OID | 2 | 0 |
| [EMail](#email) | 1 | OID | 2 | 0 |
| [ETLLastProcessedRecordID](#etllastprocessedrecordid) | 3 | yo'q (raw) | 0 | 0 |
| [EducationType](#educationtype) | 5 | OID | 1 | 1 |
| [Employee](#employee) | 0 | OID | 1 | 0 |
| [Factoring](#factoring) | 0 | OID | 7 | 1 |
| [FactoringInvoice](#factoringinvoice) | 0 | OID | 2 | 0 |
| [FactoringInvoiceRegistry](#factoringinvoiceregistry) | 0 | OID | 2 | 1 |
| [FaxNumber](#faxnumber) | 8 | OID | 2 | 0 |
| [FinObject](#finobject) | 37 251 | OID | 11 | 12 |
| [FinObjectAccount](#finobjectaccount) | 1 095 314 | OID | 5 | 1 |
| [FinObjectAttachment](#finobjectattachment) | 0 | OID | 1 | 0 |
| [FinObjectDocumentTemplate](#finobjectdocumenttemplate) | 1 667 302 | OID | 8 | 2 |
| [FinObjectExtendedProperty](#finobjectextendedproperty) | 625 302 | OID | 3 | 0 |
| [FinObjectNumerator](#finobjectnumerator) | 0 | FinObjectType, Client | 2 | 0 |
| [FinObjectOperationTemplate](#finobjectoperationtemplate) | 5 210 077 | OID | 7 | 1 |
| [FinObjectType](#finobjecttype) | 12 | OID | 1 | 8 |
| [FinObjectTypeAccount](#finobjecttypeaccount) | 129 | OID | 4 | 7 |
| [FinObjectTypeAccountFinObjectTypeAccounts_BalanceAccountBalanceAccounts](#finobjecttypeaccountfinobjecttypeaccounts_balanceaccountbalanceaccounts) | 0 | OID | 0 | 0 |
| [FinObjectTypeDocumentTemplate](#finobjecttypedocumenttemplate) | 177 | OID | 9 | 4 |
| [FinObjectTypeExtendedProperty](#finobjecttypeextendedproperty) | 70 | OID | 2 | 1 |
| [FinObjectTypeLogicalAccountGroup](#finobjecttypelogicalaccountgroup) | 17 | OID | 2 | 3 |
| [FinObjectTypeLogicalAccountGroupItem](#finobjecttypelogicalaccountgroupitem) | 28 | OID | 4 | 0 |
| [FinObjectTypeOperationTemplate](#finobjecttypeoperationtemplate) | 540 | OID | 8 | 2 |
| [FinProduct](#finproduct) | 21 | OID | 8 | 12 |
| [FinProductAccount](#finproductaccount) | 1 172 | OID | 7 | 1 |
| [FinProductAllowableFinProducts_ClientTypeClassifierAllowableClientTypeClassifiers](#finproductallowablefinproducts_clienttypeclassifierallowableclienttypeclassifiers) | 30 | OID | 2 | 0 |
| [FinProductAllowableFinProducts_ContractTemplateAllowableContractTemplates](#finproductallowablefinproducts_contracttemplateallowablecontracttemplates) | 0 | OID | 2 | 0 |
| [FinProductDocumentTemplate](#finproductdocumenttemplate) | 1 756 | OID | 6 | 2 |
| [FinProductExtendedProperty](#finproductextendedproperty) | 647 | OID | 3 | 1 |
| [FinProductOperationTemplate](#finproductoperationtemplate) | 6 663 | OID | 4 | 1 |
| [FinProductPolicy](#finproductpolicy) | 20 | OID | 2 | 0 |
| [GlobalVariable](#globalvariable) | 3 | OID | 1 | 0 |
| [GrkiBorrowerActivityType](#grkiborroweractivitytype) | 4 | OID | 1 | 1 |
| [GrkiBorrowerIncomeSourceType](#grkiborrowerincomesourcetype) | 8 | OID | 1 | 1 |
| [GrkiFactoringDirectionType](#grkifactoringdirectiontype) | 2 | OID | 1 | 1 |
| [GrkiFactoringDisclosureType](#grkifactoringdisclosuretype) | 2 | OID | 1 | 1 |
| [GrkiFactoringParticipationType](#grkifactoringparticipationtype) | 2 | OID | 1 | 1 |
| [GrkiFactoringRegressType](#grkifactoringregresstype) | 2 | OID | 1 | 1 |
| [GrkiFactoringType](#grkifactoringtype) | 2 | OID | 1 | 1 |
| [GrkiLoanAuthorityType](#grkiloanauthoritytype) | 5 | OID | 1 | 2 |
| [GroupClient](#groupclient) | 0 | OID | 3 | 0 |
| [GroupClientItem](#groupclientitem) | 0 | OID | 2 | 3 |
| [IndividualClient](#individualclient) | 19 180 | OID | 3 | 2 |
| [IndividualClientEmploymentType](#individualclientemploymenttype) | 4 | OID | 1 | 1 |
| [IndividualClientRegistrationDocument](#individualclientregistrationdocument) | 1 | OID | 2 | 0 |
| [InitialBalance](#initialbalance) | 0 | OID | 3 | 0 |
| [InterestRateFormula](#interestrateformula) | 1 | OID | 1 | 2 |
| [LegalisationInfo](#legalisationinfo) | 534 535 | yo'q (raw) | 0 | 0 |
| [LegalisationInfoStaging](#legalisationinfostaging) | 76 | yo'q (raw) | 0 | 0 |
| [LegislativeClient](#legislativeclient) | 33 | OID | 5 | 3 |
| [LegislativeClientFounder](#legislativeclientfounder) | 0 | OID | 3 | 0 |
| [LegislativeClientFoundersAgreement](#legislativeclientfoundersagreement) | 0 | OID | 2 | 1 |
| [LegislativeClientLegalForm](#legislativeclientlegalform) | 24 | OID | 1 | 1 |
| [Loan](#loan) | 15 738 | OID | 11 | 2 |
| [LoanApplication](#loanapplication) | 21 398 | OID | 7 | 4 |
| [LoanApplicationDmsApproveReason](#loanapplicationdmsapprovereason) | 0 | OID | 1 | 1 |
| [LoanApplicationDmsRejectReason](#loanapplicationdmsrejectreason) | 1 | OID | 1 | 1 |
| [LoanApplicationGrkiBorrowerIncome](#loanapplicationgrkiborrowerincome) | 0 | OID | 3 | 0 |
| [LoanApplicationParticipants](#loanapplicationparticipants) | 0 | OID | 4 | 0 |
| [LoanApplicationProduct](#loanapplicationproduct) | 1 | OID | 1 | 0 |
| [LoanApplicationRejectReason](#loanapplicationrejectreason) | 9 | OID | 1 | 1 |
| [LoanClassification](#loanclassification) | 20 117 | OID | 3 | 0 |
| [LoanClassificationType](#loanclassificationtype) | 5 | OID | 1 | 1 |
| [LoanCollateral](#loancollateral) | 18 613 | OID | 16 | 10 |
| [LoanCollateralDeposit](#loancollateraldeposit) | 0 | OID | 3 | 0 |
| [LoanCollateralEquipment](#loancollateralequipment) | 0 | OID | 1 | 0 |
| [LoanCollateralGuarantee](#loancollateralguarantee) | 20 | OID | 6 | 0 |
| [LoanCollateralInsurancePolicy](#loancollateralinsurancepolicy) | 3 338 | OID | 1 | 0 |
| [LoanCollateralJewellery](#loancollateraljewellery) | 84 | OID | 2 | 0 |
| [LoanCollateralRealEstate](#loancollateralrealestate) | 2 466 | OID | 4 | 0 |
| [LoanCollateralType](#loancollateraltype) | 36 | OID | 2 | 2 |
| [LoanCollateralVehicle](#loancollateralvehicle) | 12 705 | OID | 3 | 0 |
| [LoanProduct](#loanproduct) | 15 | OID | 4 | 1 |
| [LoanPurpose](#loanpurpose) | 319 | OID | 2 | 3 |
| [LoanPurpose112](#loanpurpose112) | 32 | OID | 1 | 0 |
| [LoanPurposeAdditional1](#loanpurposeadditional1) | 0 | OID | 1 | 1 |
| [LoanPurposeAdditional2](#loanpurposeadditional2) | 0 | OID | 1 | 1 |
| [LoanPurposeAdditional3](#loanpurposeadditional3) | 0 | OID | 1 | 1 |
| [LoanType](#loantype) | 30 | OID | 2 | 3 |
| [LoanUpdateLog](#loanupdatelog) | 166 030 | yo'q (raw) | 0 | 0 |
| [Location](#location) | 38 434 | OID | 5 | 2 |
| [LogDelete](#logdelete) | 0 | ID | 0 | 0 |
| [LogUpdate](#logupdate) | 0 | ID | 0 | 0 |
| [Mahalla](#mahalla) | 9 070 | OID | 2 | 1 |
| [NationalEconomySector](#nationaleconomysector) | 758 | OID | 1 | 3 |
| [NationalEconomySector2](#nationaleconomysector2) | 683 | OID | 1 | 1 |
| [NumerationFormulaSettings](#numerationformulasettings) | 1 | OID | 1 | 0 |
| [Numerator](#numerator) | 9 | OID | 1 | 1 |
| [NumeratorSettings](#numeratorsettings) | 12 | OID | 2 | 0 |
| [NumeratorValue](#numeratorvalue) | 51 | NumeratorSettings, KeyDate | 0 | 0 |
| [ObjectOfLeasingType](#objectofleasingtype) | 7 | OID | 1 | 2 |
| [OperDayChangeLog](#operdaychangelog) | 2 741 | yo'q (raw) | 0 | 0 |
| [Operation](#operation) | 11 181 676 | OID | 8 | 1 |
| [OperationAmountFormula](#operationamountformula) | 44 | OID | 0 | 2 |
| [OperationClassification](#operationclassification) | 0 | OID | 3 | 0 |
| [OperationClassificationRule](#operationclassificationrule) | 11 | OID | 5 | 1 |
| [OperationDescriptionFormula](#operationdescriptionformula) | 4 | OID | 1 | 1 |
| [OperationFormula](#operationformula) | 126 | OID | 2 | 13 |
| [OperationFormulaCompatibleFormulas_FinObjectTypeDocumentTemplateCompatibleDocumentTemplates](#operationformulacompatibleformulas_finobjecttypedocumenttemplatecompatibledocumenttemplates) | 0 | OID | 2 | 0 |
| [OperationFormulaCompatibleFormulas_FinObjectTypeOperationTemplateCompatibleOperationTemplates](#operationformulacompatibleformulas_finobjecttypeoperationtemplatecompatibleoperationtemplates) | 0 | OID | 2 | 0 |
| [OperationNumerationFormula](#operationnumerationformula) | 1 | OID | 1 | 0 |
| [OperationPrintingFormula](#operationprintingformula) | 2 | yo'q (raw) | 1 | 0 |
| [OperationPrintingItem](#operationprintingitem) | 3 | OID | 0 | 0 |
| [OperationPrintingItemCard](#operationprintingitemcard) | 429 | OID | 0 | 0 |
| [OperationalAccount](#operationalaccount) | 507 446 | OID | 4 | 10 |
| [Passport](#passport) | 19 188 | OID | 5 | 1 |
| [PassportType](#passporttype) | 10 | OID | 1 | 1 |
| [PaymentDocumentType](#paymentdocumenttype) | 0 | OID | 1 | 0 |
| [PaymentType](#paymenttype) | 4 | OID | 1 | 3 |
| [PersistentImage](#persistentimage) | 0 | OID | 1 | 0 |
| [Person](#person) | 19 185 | OID | 3 | 4 |
| [PreciousMetalFineness](#preciousmetalfineness) | 16 | OID | 2 | 2 |
| [PreciousMetalRate](#preciousmetalrate) | 16 | OID | 2 | 0 |
| [PreciousMetalType](#preciousmetaltype) | 2 | OID | 1 | 1 |
| [PrintingObjectFormula](#printingobjectformula) | 1 | OID | 1 | 0 |
| [PropertyAppraisalReport](#propertyappraisalreport) | 13 | OID | 2 | 0 |
| [PropertyInsurancePolicy](#propertyinsurancepolicy) | 0 | OID | 2 | 0 |
| [PropertyType](#propertytype) | 54 | OID | 1 | 1 |
| [Region](#region) | 14 | OID | 2 | 6 |
| [RegistrationPlace](#registrationplace) | 54 | OID | 1 | 1 |
| [RepresentationContractType](#representationcontracttype) | 3 | OID | 1 | 1 |
| [RepresentationType](#representationtype) | 4 | OID | 1 | 1 |
| [Representative](#representative) | 4 | OID | 4 | 0 |
| [ResidencyType](#residencytype) | 2 | OID | 1 | 2 |
| [ScheduleConfiguration](#scheduleconfiguration) | 3 | OID | 2 | 0 |
| [Share](#share) | 4 | OID | 1 | 0 |
| [ShareProduct](#shareproduct) | 1 | OID | 1 | 0 |
| [SimpleOperationTemplate](#simpleoperationtemplate) | 0 | OID | 1 | 0 |
| [TMP_RequestedPinfl](#tmp_requestedpinfl) | 287 | yo'q (raw) | 0 | 0 |
| [Tag](#tag) | 7 706 | OID | 2 | 0 |
| [TagType](#tagtype) | 11 | OID | 1 | 1 |
| [TaxOrganisation](#taxorganisation) | 236 | OID | 1 | 1 |
| [TelephoneNumber](#telephonenumber) | 43 724 | OID | 2 | 0 |
| [TemplateAvailabilityFormula](#templateavailabilityformula) | 34 | OID | 1 | 3 |
| [ThisCompany](#thiscompany) | 1 | OID | 1 | 1 |
| [TurnoverAndBalanceCacheWithQualifier](#turnoverandbalancecachewithqualifier) | 10 686 223 | Date, Account, AccountQualifier, Type | 0 | 0 |
| [UserSettings](#usersettings) | 158 | OID | 1 | 1 |
| [VehicleType](#vehicletype) | 6 | OID | 1 | 1 |
| [XPDeletedObject](#xpdeletedobject) | 4 444 | OID | 1 | 132 |
| [XPObjectType](#xpobjecttype) | 137 | OID | 0 | 9 |
| [dtproperties](#dtproperties) | 28 | id, property | 0 | 0 |
| [isGUIPermission](#isguipermission) | 5 | OID | 1 | 0 |
| [isPermissionTemplate](#ispermissiontemplate) | 69 | OID | 2 | 0 |
| [isTableList](#istablelist) | 158 | OID | 0 | 1 |
| [isUser](#isuser) | 142 | OID | 4 | 7 |
| [isUserGroup](#isusergroup) | 6 | OID | 1 | 2 |
| [sysdiagrams](#sysdiagrams) | 3 | diagram_id | 0 | 0 |
| [tblAccounts](#tblaccounts) | 321 | Account | 0 | 0 |
| [tmpApplicationEntry](#tmpapplicationentry) | 97 | yo'q (raw) | 0 | 0 |
| [tmpProlongatedLoans](#tmpprolongatedloans) | 2 557 | Loan, OperDay | 0 | 0 |
| [tmpSchedule](#tmpschedule) | 0 | FinObjectOID, Date, TemplateCode | 0 | 0 |
| [tmpTable](#tmptable) | 111 | yo'q (raw) | 0 | 0 |

## Affiliation_Relation

`Affiliation.Relation` · 0 qator · PK: OID · 11 ustun

`GET /v1/Affiliation_Relation` · `GET /v1/Affiliation_Relation/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `RelationTypeOID` | [Affiliation_RelationType](#affiliation_relationtype) | OID |
| `InfluentialClient` | [BaseClient](#baseclient) | OID |
| `DependentClient` | [BaseClient](#baseclient) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `CreatedBy` | [isUser](#isuser) | OID |

Misol: `/v1/Affiliation_Relation?expand=RelationTypeOID`

## Affiliation_RelationGroupType

`Affiliation.RelationGroupType` · 2 qator · PK: OID · 9 ustun

`GET /v1/Affiliation_RelationGroupType` · `GET /v1/Affiliation_RelationGroupType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/Affiliation_RelationGroupType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Affiliation_RelationType](#affiliation_relationtype) | `RelationGroupTypeOID` | `/v1/Affiliation_RelationGroupType/{id}/Affiliation_RelationType?by=RelationGroupTypeOID` |

## Affiliation_RelationHistory

`Affiliation.RelationHistory` · 0 qator · PK: OID · 14 ustun

`GET /v1/Affiliation_RelationHistory` · `GET /v1/Affiliation_RelationHistory/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `RelationTypeOID` | [Affiliation_RelationType](#affiliation_relationtype) | OID |
| `DependentClient` | [BaseClient](#baseclient) | OID |
| `InfluentialClient` | [BaseClient](#baseclient) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `CreatedBy` | [isUser](#isuser) | OID |
| `MovedToHistoryBy` | [isUser](#isuser) | OID |

Misol: `/v1/Affiliation_RelationHistory?expand=RelationTypeOID`

## Affiliation_RelationType

`Affiliation.RelationType` · 19 qator · PK: OID · 10 ustun

`GET /v1/Affiliation_RelationType` · `GET /v1/Affiliation_RelationType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `RelationGroupTypeOID` | [Affiliation_RelationGroupType](#affiliation_relationgrouptype) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/Affiliation_RelationType?expand=RelationGroupTypeOID`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Affiliation_Relation](#affiliation_relation) | `RelationTypeOID` | `/v1/Affiliation_RelationType/{id}/Affiliation_Relation?by=RelationTypeOID` |
| [Affiliation_RelationHistory](#affiliation_relationhistory) | `RelationTypeOID` | `/v1/Affiliation_RelationType/{id}/Affiliation_RelationHistory?by=RelationTypeOID` |

## CBReport_ChartOfAccounts

`CBReport.ChartOfAccounts` · 557 qator · PK: yo'q · 6 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/CBReport.ChartOfAccounts`.

## CBReport_FieldValue

`CBReport.FieldValue` · 60 qator · PK: yo'q · 3 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/CBReport.FieldValue`.

## CBReport_LoanPortfolio

`CBReport.LoanPortfolio` · 0 qator · PK: yo'q · 47 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/CBReport.LoanPortfolio`.

## CBReport_LoanPortfolioLiquidityPrincipalPayment

`CBReport.LoanPortfolioLiquidityPrincipalPayment` · 85 694 qator · PK: yo'q · 4 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/CBReport.LoanPortfolioLiquidityPrincipalPayment`.

## CBReport_LoanStatisticsByType

`CBReport.LoanStatisticsByType` · 204 qator · PK: yo'q · 12 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/CBReport.LoanStatisticsByType`.

## CBReport_TurnoverAndBalanceSheet

`CBReport.TurnoverAndBalanceSheet` · 1 444 qator · PK: yo'q · 8 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/CBReport.TurnoverAndBalanceSheet`.

## CLRUtil_SubstitutionRule

`CLRUtil.SubstitutionRule` · 172 qator · PK: RuleId, KeyString · 3 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## CLRUtil_SubstitutionRuleType

`CLRUtil.SubstitutionRuleType` · 3 qator · PK: Id · 2 ustun

`GET /v1/CLRUtil_SubstitutionRuleType` · `GET /v1/CLRUtil_SubstitutionRuleType/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## CdcCore_ChangedEntity

`CdcCore.ChangedEntity` · 14 014 qator · PK: yo'q · 19 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/CdcCore.ChangedEntity`.

## CdcCore_Configuration

`CdcCore.Configuration` · 1 qator · PK: yo'q · 1 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/CdcCore.Configuration`.

## CdcCore_HealthCheck

`CdcCore.HealthCheck` · 1 qator · PK: LastCheckTime · 1 ustun

`GET /v1/CdcCore_HealthCheck` · `GET /v1/CdcCore_HealthCheck/{LastCheckTime}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## CdcCore_Projects

`CdcCore.Projects` · 16 qator · PK: ProjectName · 2 ustun

`GET /v1/CdcCore_Projects` · `GET /v1/CdcCore_Projects/{ProjectName}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## CdcCore_Session

`CdcCore.Session` · 1 qator · PK: yo'q · 4 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/CdcCore.Session`.

## CloseOperDay_ExecutionProcessState

`CloseOperDay.ExecutionProcessState` · 1 qator · PK: OID · 8 ustun

`GET /v1/CloseOperDay_ExecutionProcessState` · `GET /v1/CloseOperDay_ExecutionProcessState/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `InitiatedUser` | [isUser](#isuser) | OID |

Misol: `/v1/CloseOperDay_ExecutionProcessState?expand=InitiatedUser`

## CloseOperDay_ExecutionProcessStateLog

`CloseOperDay.ExecutionProcessStateLog` · 20 240 qator · PK: OID · 12 ustun

`GET /v1/CloseOperDay_ExecutionProcessStateLog` · `GET /v1/CloseOperDay_ExecutionProcessStateLog/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## CollateralRegistry_SchemaVersions

`CollateralRegistry.SchemaVersions` · 43 qator · PK: Id · 3 ustun

`GET /v1/CollateralRegistry_SchemaVersions` · `GET /v1/CollateralRegistry_SchemaVersions/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## Crif_SchemaVersions

`Crif.SchemaVersions` · 7 qator · PK: Id · 3 ustun

`GET /v1/Crif_SchemaVersions` · `GET /v1/Crif_SchemaVersions/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## DCR_AccountCodeMapping

`DCR.AccountCodeMapping` · 10 qator · PK: Code, Priority · 4 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## DCR_Channel

`DCR.Channel` · 13 qator · PK: Id · 2 ustun

`GET /v1/DCR_Channel` · `GET /v1/DCR_Channel/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## DCR_FinObjectTypeAccountMapping

`DCR.FinObjectTypeAccountMapping` · 15 qator · PK: IsBalanceAccount, FinObjectTypeAccountOID, AccountQualifier · 4 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## DCR_ReplicationSession

`DCR.ReplicationSession` · 1 qator · PK: Id · 3 ustun

`GET /v1/DCR_ReplicationSession` · `GET /v1/DCR_ReplicationSession/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## DCR_SchemaVersions

`DCR.SchemaVersions` · 75 qator · PK: Id · 3 ustun

`GET /v1/DCR_SchemaVersions` · `GET /v1/DCR_SchemaVersions/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## DCR_TmpChangedEntity

`DCR.TmpChangedEntity` · 0 qator · PK: EntityId, EntityType · 2 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## DCR_TmpLoanOperationBatch

`DCR.TmpLoanOperationBatch` · 0 qator · PK: yo'q · 9 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/DCR.TmpLoanOperationBatch`.

## DCR_TmpLoanScheduleBatch

`DCR.TmpLoanScheduleBatch` · 0 qator · PK: yo'q · 7 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/DCR.TmpLoanScheduleBatch`.

## DebtCollector_ClientBinding

`DebtCollector.ClientBinding` · 275 qator · PK: ClientPublicId · 2 ustun

`GET /v1/DebtCollector_ClientBinding` · `GET /v1/DebtCollector_ClientBinding/{ClientPublicId}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## DebtCollector_SchemaVersions

`DebtCollector.SchemaVersions` · 29 qator · PK: Id · 3 ustun

`GET /v1/DebtCollector_SchemaVersions` · `GET /v1/DebtCollector_SchemaVersions/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## FlexFinApi_AccountCodeMapping

`FlexFinApi.AccountCodeMapping` · 9 qator · PK: Code, Priority · 4 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## FlexFinApi_Channel

`FlexFinApi.Channel` · 12 qator · PK: yo'q · 2 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/FlexFinApi.Channel`.

## FlexFinApi_FinObjectTypeAccountMapping

`FlexFinApi.FinObjectTypeAccountMapping` · 15 qator · PK: IsBalanceAccount, FinObjectTypeAccountOID, AccountQualifier · 4 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## FlexFinApi_LastExportedDocumentStateOID

`FlexFinApi.LastExportedDocumentStateOID` · 1 qator · PK: DocumentStateOID · 1 ustun

`GET /v1/FlexFinApi_LastExportedDocumentStateOID` · `GET /v1/FlexFinApi_LastExportedDocumentStateOID/{DocumentStateOID}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## FlexFinApi_LoanApplicationEarlyRejected

`FlexFinApi.LoanApplicationEarlyRejected` · 89 qator · PK: LoanApplicationPublicId · 1 ustun

`GET /v1/FlexFinApi_LoanApplicationEarlyRejected` · `GET /v1/FlexFinApi_LoanApplicationEarlyRejected/{LoanApplicationPublicId}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## FlexFinApi_LoanCollateralsWithInsertedOffbalanceOperations

`FlexFinApi.LoanCollateralsWithInsertedOffbalanceOperations` · 10 123 qator · PK: LoanCollateralOid · 2 ustun

`GET /v1/FlexFinApi_LoanCollateralsWithInsertedOffbalanceOperations` · `GET /v1/FlexFinApi_LoanCollateralsWithInsertedOffbalanceOperations/{LoanCollateralOid}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `LoanCollateralOid` | [LoanCollateral](#loancollateral) | OID |

Misol: `/v1/FlexFinApi_LoanCollateralsWithInsertedOffbalanceOperations?expand=LoanCollateralOid`

## FlexFinApi_OperationCache

`FlexFinApi.OperationCache` · 272 874 qator · PK: LoanOID, OperationOID, Date, Amount, Account · 8 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## FlexFinApi_SchemaVersions

`FlexFinApi.SchemaVersions` · 375 qator · PK: Id · 3 ustun

`GET /v1/FlexFinApi_SchemaVersions` · `GET /v1/FlexFinApi_SchemaVersions/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## Grki_FinObjectChangeQueue

`Grki.FinObjectChangeQueue` · 0 qator · PK: FinObjectId · 4 ustun

`GET /v1/Grki_FinObjectChangeQueue` · `GET /v1/Grki_FinObjectChangeQueue/{FinObjectId}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## Grki_FinObjectTypeAccountMapping

`Grki.FinObjectTypeAccountMapping` · 28 qator · PK: IsBalanceAccount, FinObjectTypeAccountOID, AccountQualifier, IsLmb · 5 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## Grki_InitialOperDay

`Grki.InitialOperDay` · 1 qator · PK: OperDay · 1 ustun

`GET /v1/Grki_InitialOperDay` · `GET /v1/Grki_InitialOperDay/{OperDay}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## Grki_LoanApplicationGrkiRegistartionNumber

`Grki.LoanApplicationGrkiRegistartionNumber` · 12 500 qator · PK: GrkiIdentifier · 4 ustun

`GET /v1/Grki_LoanApplicationGrkiRegistartionNumber` · `GET /v1/Grki_LoanApplicationGrkiRegistartionNumber/{GrkiIdentifier}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Client` | [BaseClient](#baseclient) | OID |
| `LoanApplication` | [LoanApplication](#loanapplication) | OID |

Misol: `/v1/Grki_LoanApplicationGrkiRegistartionNumber?expand=Client`

## Grki_SchemaVersions

`Grki.SchemaVersions` · 349 qator · PK: Id · 3 ustun

`GET /v1/Grki_SchemaVersions` · `GET /v1/Grki_SchemaVersions/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## Legalisation_BlackListCheckReport

`Legalisation.BlackListCheckReport` · 38 qator · PK: ID · 17 ustun

`GET /v1/Legalisation_BlackListCheckReport` · `GET /v1/Legalisation_BlackListCheckReport/{ID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `BlackListCheckReportTaskID` | [Legalisation_BlackListCheckReportTask](#legalisation_blacklistcheckreporttask) | ID |

Misol: `/v1/Legalisation_BlackListCheckReport?expand=BlackListCheckReportTaskID`

## Legalisation_BlackListCheckReportTask

`Legalisation.BlackListCheckReportTask` · 5 qator · PK: ID · 9 ustun

`GET /v1/Legalisation_BlackListCheckReportTask` · `GET /v1/Legalisation_BlackListCheckReportTask/{ID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Legalisation_BlackListCheckReport](#legalisation_blacklistcheckreport) | `BlackListCheckReportTaskID` | `/v1/Legalisation_BlackListCheckReportTask/{id}/Legalisation_BlackListCheckReport?by=BlackListCheckReportTaskID` |

## LegalizationUpdater_LetterOption

`LegalizationUpdater.LetterOption` · 327 qator · PK: yo'q · 3 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/LegalizationUpdater.LetterOption`.

## LegalizationUpdater_ListCodeReference

`LegalizationUpdater.ListCodeReference` · 6 qator · PK: ListCode · 3 ustun

`GET /v1/LegalizationUpdater_ListCodeReference` · `GET /v1/LegalizationUpdater_ListCodeReference/{ListCode}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## LegalizationUpdater_SchemaVersions

`LegalizationUpdater.SchemaVersions` · 13 qator · PK: Id · 3 ustun

`GET /v1/LegalizationUpdater_SchemaVersions` · `GET /v1/LegalizationUpdater_SchemaVersions/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## LegalizationUpdater_UpdaterFailsHistory

`LegalizationUpdater.UpdaterFailsHistory` · 1 qator · PK: MessageId · 6 ustun

`GET /v1/LegalizationUpdater_UpdaterFailsHistory` · `GET /v1/LegalizationUpdater_UpdaterFailsHistory/{MessageId}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## PMT_CanceledDisbursement

`PMT.CanceledDisbursement` · 0 qator · PK: yo'q · 9 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/PMT.CanceledDisbursement`.

## PMT_CanceledDisbursementTransaction

`PMT.CanceledDisbursementTransaction` · 0 qator · PK: Id · 6 ustun

`GET /v1/PMT_CanceledDisbursementTransaction` · `GET /v1/PMT_CanceledDisbursementTransaction/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## PMT_Disbursement

`PMT.Disbursement` · 67 qator · PK: yo'q · 8 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/PMT.Disbursement`.

## PMT_DisbursementTransaction

`PMT.DisbursementTransaction` · 67 qator · PK: Id · 5 ustun

`GET /v1/PMT_DisbursementTransaction` · `GET /v1/PMT_DisbursementTransaction/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## PMT_PaymentTransaction

`PMT.PaymentTransaction` · 73 776 qator · PK: PaymentSystem, ExternalId · 8 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## PMT_SchemaVersions

`PMT.SchemaVersions` · 28 qator · PK: Id · 3 ustun

`GET /v1/PMT_SchemaVersions` · `GET /v1/PMT_SchemaVersions/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## Report_DataSource

`Report.DataSource` · 4 qator · PK: Id · 6 ustun

`GET /v1/Report_DataSource` · `GET /v1/Report_DataSource/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## Report_FinObjectMetaData

`Report.FinObjectMetaData` · 4 qator · PK: yo'q · 3 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/Report.FinObjectMetaData`.

## Report_ItemType

`Report.ItemType` · 2 qator · PK: Id · 2 ustun

`GET /v1/Report_ItemType` · `GET /v1/Report_ItemType/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Report_ReportItem](#report_reportitem) | `ItemType` | `/v1/Report_ItemType/{id}/Report_ReportItem?by=ItemType` |

## Report_Package

`Report.Package` · 2 qator · PK: Id · 2 ustun

`GET /v1/Report_Package` · `GET /v1/Report_Package/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## Report_ReportItem

`Report.ReportItem` · 8 qator · PK: Id · 8 ustun

`GET /v1/Report_ReportItem` · `GET /v1/Report_ReportItem/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `ItemType` | [Report_ItemType](#report_itemtype) | Id |
| `Parent` | [Report_ReportItem](#report_reportitem) | Id |

Misol: `/v1/Report_ReportItem?expand=ItemType`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Report_ReportItem](#report_reportitem) | `Parent` | `/v1/Report_ReportItem/{id}/Report_ReportItem?by=Parent` |

## Report_ReportLayout

`Report.ReportLayout` · 4 qator · PK: Id · 2 ustun

`GET /v1/Report_ReportLayout` · `GET /v1/Report_ReportLayout/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## ReportGenerator_DataSource

`ReportGenerator.DataSource` · 1 qator · PK: Id · 8 ustun

`GET /v1/ReportGenerator_DataSource` · `GET /v1/ReportGenerator_DataSource/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [ReportGenerator_RegistryFile](#reportgenerator_registryfile) | `DataSourceId` | `/v1/ReportGenerator_DataSource/{id}/ReportGenerator_RegistryFile?by=DataSourceId` |
| [ReportGenerator_ReportPackage](#reportgenerator_reportpackage) | `DataSourceId` | `/v1/ReportGenerator_DataSource/{id}/ReportGenerator_ReportPackage?by=DataSourceId` |
| [ReportGenerator_SampleData](#reportgenerator_sampledata) | `DataSourceId` | `/v1/ReportGenerator_DataSource/{id}/ReportGenerator_SampleData?by=DataSourceId` |

## ReportGenerator_FileType

`ReportGenerator.FileType` · 2 qator · PK: Id · 3 ustun

`GET /v1/ReportGenerator_FileType` · `GET /v1/ReportGenerator_FileType/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [ReportGenerator_RegistryFile](#reportgenerator_registryfile) | `FileType` | `/v1/ReportGenerator_FileType/{id}/ReportGenerator_RegistryFile?by=FileType` |

## ReportGenerator_RegistryFile

`ReportGenerator.RegistryFile` · 8 qator · PK: Id · 3 ustun

`GET /v1/ReportGenerator_RegistryFile` · `GET /v1/ReportGenerator_RegistryFile/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `DataSourceId` | [ReportGenerator_DataSource](#reportgenerator_datasource) | Id |
| `FileType` | [ReportGenerator_FileType](#reportgenerator_filetype) | Id |
| `Id` | [ReportGenerator_RegistryItem](#reportgenerator_registryitem) | Id |

Misol: `/v1/ReportGenerator_RegistryFile?expand=DataSourceId`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [ReportGenerator_RegistryFileContent](#reportgenerator_registryfilecontent) | `Id` | `/v1/ReportGenerator_RegistryFile/{id}/ReportGenerator_RegistryFileContent?by=Id` |

## ReportGenerator_RegistryFileContent

`ReportGenerator.RegistryFileContent` · 8 qator · PK: Id · 2 ustun

`GET /v1/ReportGenerator_RegistryFileContent` · `GET /v1/ReportGenerator_RegistryFileContent/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Id` | [ReportGenerator_RegistryFile](#reportgenerator_registryfile) | Id |

Misol: `/v1/ReportGenerator_RegistryFileContent?expand=Id`

## ReportGenerator_RegistryItem

`ReportGenerator.RegistryItem` · 11 qator · PK: Id · 8 ustun

`GET /v1/ReportGenerator_RegistryItem` · `GET /v1/ReportGenerator_RegistryItem/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Id` | [ReportGenerator_RegistryItem](#reportgenerator_registryitem) | Id |

Misol: `/v1/ReportGenerator_RegistryItem?expand=Id`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [ReportGenerator_RegistryItem](#reportgenerator_registryitem) | `Id` | `/v1/ReportGenerator_RegistryItem/{id}/ReportGenerator_RegistryItem?by=Id` |
| [ReportGenerator_RegistryFile](#reportgenerator_registryfile) | `Id` | `/v1/ReportGenerator_RegistryItem/{id}/ReportGenerator_RegistryFile?by=Id` |

## ReportGenerator_ReportBinding

`ReportGenerator.ReportBinding` · 8 qator · PK: PackageId, FileId · 4 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## ReportGenerator_ReportPackage

`ReportGenerator.ReportPackage` · 1 qator · PK: Id · 3 ustun

`GET /v1/ReportGenerator_ReportPackage` · `GET /v1/ReportGenerator_ReportPackage/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `DataSourceId` | [ReportGenerator_DataSource](#reportgenerator_datasource) | Id |

Misol: `/v1/ReportGenerator_ReportPackage?expand=DataSourceId`

## ReportGenerator_SampleData

`ReportGenerator.SampleData` · 1 qator · PK: Id · 5 ustun

`GET /v1/ReportGenerator_SampleData` · `GET /v1/ReportGenerator_SampleData/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `DataSourceId` | [ReportGenerator_DataSource](#reportgenerator_datasource) | Id |

Misol: `/v1/ReportGenerator_SampleData?expand=DataSourceId`

## ReportGenerator_SchemaVersions

`ReportGenerator.SchemaVersions` · 58 qator · PK: Id · 3 ustun

`GET /v1/ReportGenerator_SchemaVersions` · `GET /v1/ReportGenerator_SchemaVersions/{Id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## ASOKIClientType

`dbo.ASOKIClientType` · 14 qator · PK: OID · 15 ustun

`GET /v1/ASOKIClientType` · `GET /v1/ASOKIClientType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ASOKIClientType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LegislativeClient](#legislativeclient) | `ASOKIClientType` | `/v1/ASOKIClientType/{id}/LegislativeClient?by=ASOKIClientType` |
| [LoanCollateralGuarantee](#loancollateralguarantee) | `GuarantorASOKIClientTypeToDelete` | `/v1/ASOKIClientType/{id}/LoanCollateralGuarantee?by=GuarantorASOKIClientTypeToDelete` |

## ASOKICollateralStatus_A13Reference

`dbo.ASOKICollateralStatus_A13Reference` · 3 qator · PK: OID · 10 ustun

`GET /v1/ASOKICollateralStatus_A13Reference` · `GET /v1/ASOKICollateralStatus_A13Reference/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ASOKICollateralStatus_A13Reference?expand=GCRecord`

## ASOKIDepositType

`dbo.ASOKIDepositType` · 2 qator · PK: OID · 13 ustun

`GET /v1/ASOKIDepositType` · `GET /v1/ASOKIDepositType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ASOKIDepositType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanCollateralDeposit](#loancollateraldeposit) | `ASOKIDepositType` | `/v1/ASOKIDepositType/{id}/LoanCollateralDeposit?by=ASOKIDepositType` |

## ASOKIIgnoreList

`dbo.ASOKIIgnoreList` · 0 qator · PK: OID · 2 ustun

`GET /v1/ASOKIIgnoreList` · `GET /v1/ASOKIIgnoreList/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## ASOKILoanApplicationParticipantStatus_A19Reference

`dbo.ASOKILoanApplicationParticipantStatus_A19Reference` · 2 qator · PK: OID · 10 ustun

`GET /v1/ASOKILoanApplicationParticipantStatus_A19Reference` · `GET /v1/ASOKILoanApplicationParticipantStatus_A19Reference/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ASOKILoanApplicationParticipantStatus_A19Reference?expand=GCRecord`

## ASOKILoanApplicationParticipantType_A18Reference

`dbo.ASOKILoanApplicationParticipantType_A18Reference` · 4 qator · PK: OID · 10 ustun

`GET /v1/ASOKILoanApplicationParticipantType_A18Reference` · `GET /v1/ASOKILoanApplicationParticipantType_A18Reference/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ASOKILoanApplicationParticipantType_A18Reference?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanApplicationParticipants](#loanapplicationparticipants) | `ASOKILoanApplicationParticipantType` | `/v1/ASOKILoanApplicationParticipantType_A18Reference/{id}/LoanApplicationParticipants?by=ASOKILoanApplicationParticipantType` |

## AccountCodeFormula

`dbo.AccountCodeFormula` · 2 qator · PK: OID · 2 ustun

`GET /v1/AccountCodeFormula` · `GET /v1/AccountCodeFormula/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [OperationFormula](#operationformula) | OID |

Misol: `/v1/AccountCodeFormula?expand=OID`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [AccountCodeFormulaSettings](#accountcodeformulasettings) | `AccountCodeFormula` | `/v1/AccountCodeFormula/{id}/AccountCodeFormulaSettings?by=AccountCodeFormula` |

## AccountCodeFormulaSettings

`dbo.AccountCodeFormulaSettings` · 1 qator · PK: OID · 8 ustun

`GET /v1/AccountCodeFormulaSettings` · `GET /v1/AccountCodeFormulaSettings/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `AccountCodeFormula` | [AccountCodeFormula](#accountcodeformula) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/AccountCodeFormulaSettings?expand=AccountCodeFormula`

## AccountLogicalGroup

`dbo.AccountLogicalGroup` · 0 qator · PK: OID · 11 ustun

`GET /v1/AccountLogicalGroup` · `GET /v1/AccountLogicalGroup/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/AccountLogicalGroup?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BalanceAccountToLogicalGroupBinding](#balanceaccounttologicalgroupbinding) | `LogicalGroup` | `/v1/AccountLogicalGroup/{id}/BalanceAccountToLogicalGroupBinding?by=LogicalGroup` |

## AccountNumerator

`dbo.AccountNumerator` · 0 qator · PK: BalanceAccountCode, Client · 3 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## AccountQualifierAsFinObject

`dbo.AccountQualifierAsFinObject` · 37 251 qator · PK: OID · 3 ustun

`GET /v1/AccountQualifierAsFinObject` · `GET /v1/AccountQualifierAsFinObject/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `FinObject` | [FinObject](#finobject) | OID |

Misol: `/v1/AccountQualifierAsFinObject?expand=OID`

## AccountQualifierType

`dbo.AccountQualifierType` · 15 qator · PK: OID · 9 ustun

`GET /v1/AccountQualifierType` · `GET /v1/AccountQualifierType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/AccountQualifierType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BaseAccountQualifier](#baseaccountqualifier) | `AccountQualifierType` | `/v1/AccountQualifierType/{id}/BaseAccountQualifier?by=AccountQualifierType` |
| [FinObjectTypeAccount](#finobjecttypeaccount) | `AccountQualifierType` | `/v1/AccountQualifierType/{id}/FinObjectTypeAccount?by=AccountQualifierType` |
| [BalanceAccount](#balanceaccount) | `AccountQualifierType` | `/v1/AccountQualifierType/{id}/BalanceAccount?by=AccountQualifierType` |

## AffiliationType

`dbo.AffiliationType` · 5 qator · PK: OID · 15 ustun

`GET /v1/AffiliationType` · `GET /v1/AffiliationType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/AffiliationType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BaseClient](#baseclient) | `Affiliation` | `/v1/AffiliationType/{id}/BaseClient?by=Affiliation` |

## ApplicationData

`dbo.ApplicationData` · 1 qator · PK: OID · 11 ustun

`GET /v1/ApplicationData` · `GET /v1/ApplicationData/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `ThisCompany` | [ThisCompany](#thiscompany) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ApplicationData?expand=ThisCompany`

## ApplicationEntry

`dbo.ApplicationEntry` · 196 qator · PK: ApplicationName, RelativePathName · 8 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## BackupDatabaseErrorLog

`dbo.BackupDatabaseErrorLog` · 40 qator · PK: OID · 5 ustun

`GET /v1/BackupDatabaseErrorLog` · `GET /v1/BackupDatabaseErrorLog/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `BackupOID` | [BackupDatabaseLog](#backupdatabaselog) | OID |

Misol: `/v1/BackupDatabaseErrorLog?expand=BackupOID`

## BackupDatabaseLog

`dbo.BackupDatabaseLog` · 2 958 qator · PK: OID · 11 ustun

`GET /v1/BackupDatabaseLog` · `GET /v1/BackupDatabaseLog/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `CreatedUserOID` | [isUser](#isuser) | OID |

Misol: `/v1/BackupDatabaseLog?expand=CreatedUserOID`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BackupDatabaseErrorLog](#backupdatabaseerrorlog) | `BackupOID` | `/v1/BackupDatabaseLog/{id}/BackupDatabaseErrorLog?by=BackupOID` |

## BackupDatabaseSettings

`dbo.BackupDatabaseSettings` · 1 qator · PK: OID · 3 ustun

`GET /v1/BackupDatabaseSettings` · `GET /v1/BackupDatabaseSettings/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## BalanceAccount

`dbo.BalanceAccount` · 688 qator · PK: OID · 6 ustun

`GET /v1/BalanceAccount` · `GET /v1/BalanceAccount/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OwnerType` | [FinObjectType](#finobjecttype) | OID |
| `ClientType` | [ClientType](#clienttype) | OID |
| `AccountQualifierType` | [AccountQualifierType](#accountqualifiertype) | OID |
| `OID` | [BaseAccount](#baseaccount) | OID |

Misol: `/v1/BalanceAccount?expand=OwnerType`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BalanceAccountToFinObjectTypeAccountBinding](#balanceaccounttofinobjecttypeaccountbinding) | `BalanceAccount` | `/v1/BalanceAccount/{id}/BalanceAccountToFinObjectTypeAccountBinding?by=BalanceAccount` |
| [BalanceAccountToLogicalGroupBinding](#balanceaccounttologicalgroupbinding) | `BalanceAccount` | `/v1/BalanceAccount/{id}/BalanceAccountToLogicalGroupBinding?by=BalanceAccount` |

## BalanceAccountBalanceAccounts_AccountLogicalGroupLogicalGroups

`dbo.BalanceAccountBalanceAccounts_AccountLogicalGroupLogicalGroups` · 0 qator · PK: OID · 5 ustun

`GET /v1/BalanceAccountBalanceAccounts_AccountLogicalGroupLogicalGroups` · `GET /v1/BalanceAccountBalanceAccounts_AccountLogicalGroupLogicalGroups/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## BalanceAccountToFinObjectTypeAccountBinding

`dbo.BalanceAccountToFinObjectTypeAccountBinding` · 919 qator · PK: OID · 5 ustun

`GET /v1/BalanceAccountToFinObjectTypeAccountBinding` · `GET /v1/BalanceAccountToFinObjectTypeAccountBinding/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `FinObjectTypeAccount` | [FinObjectTypeAccount](#finobjecttypeaccount) | OID |
| `BalanceAccount` | [BalanceAccount](#balanceaccount) | OID |

Misol: `/v1/BalanceAccountToFinObjectTypeAccountBinding?expand=FinObjectTypeAccount`

## BalanceAccountToLogicalGroupBinding

`dbo.BalanceAccountToLogicalGroupBinding` · 0 qator · PK: OID · 5 ustun

`GET /v1/BalanceAccountToLogicalGroupBinding` · `GET /v1/BalanceAccountToLogicalGroupBinding/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `LogicalGroup` | [AccountLogicalGroup](#accountlogicalgroup) | OID |
| `BalanceAccount` | [BalanceAccount](#balanceaccount) | OID |

Misol: `/v1/BalanceAccountToLogicalGroupBinding?expand=LogicalGroup`

## Bank

`dbo.Bank` · 63 qator · PK: OID · 17 ustun

`GET /v1/Bank` · `GET /v1/Bank/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Country` | [Country](#country) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/Bank?expand=Country`

## BankBranch

`dbo.BankBranch` · 1 217 qator · PK: OID · 19 ustun

`GET /v1/BankBranch` · `GET /v1/BankBranch/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Region` | [Region](#region) | OID |
| `District` | [District](#district) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/BankBranch?expand=Region`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [ClientBankAccount](#clientbankaccount) | `BankBranch` | `/v1/BankBranch/{id}/ClientBankAccount?by=BankBranch` |
| [LoanCollateralGuarantee](#loancollateralguarantee) | `GuarantorBankBranchToDelete` | `/v1/BankBranch/{id}/LoanCollateralGuarantee?by=GuarantorBankBranchToDelete` |
| [LoanCollateralDeposit](#loancollateraldeposit) | `DepositBankBranch` | `/v1/BankBranch/{id}/LoanCollateralDeposit?by=DepositBankBranch` |

## BaseAccount

`dbo.BaseAccount` · 508 134 qator · PK: OID · 21 ustun

`GET /v1/BaseAccount` · `GET /v1/BaseAccount/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Branch` | [Branch](#branch) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `ObjectType` | [XPObjectType](#xpobjecttype) | OID |
| `Parent` | [BaseAccount](#baseaccount) | OID |

Misol: `/v1/BaseAccount?expand=Branch`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinProductAccount](#finproductaccount) | `Account` | `/v1/BaseAccount/{id}/FinProductAccount?by=Account` |
| [BalanceAccount](#balanceaccount) | `OID` | `/v1/BaseAccount/{id}/BalanceAccount?by=OID` |
| [BaseAccount](#baseaccount) | `Parent` | `/v1/BaseAccount/{id}/BaseAccount?by=Parent` |
| [OperationalAccount](#operationalaccount) | `OID` | `/v1/BaseAccount/{id}/OperationalAccount?by=OID` |
| [FinProductAccount](#finproductaccount) | `DefaultAccount` | `/v1/BaseAccount/{id}/FinProductAccount?by=DefaultAccount` |
| [FinObjectAccount](#finobjectaccount) | `DefaultAccount` | `/v1/BaseAccount/{id}/FinObjectAccount?by=DefaultAccount` |

## BaseAccountQualifier

`dbo.BaseAccountQualifier` · 37 287 qator · PK: OID · 13 ustun

`GET /v1/BaseAccountQualifier` · `GET /v1/BaseAccountQualifier/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `ObjectType` | [XPObjectType](#xpobjecttype) | OID |
| `AccountQualifierType` | [AccountQualifierType](#accountqualifiertype) | OID |

Misol: `/v1/BaseAccountQualifier?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinObjectTypeAccount](#finobjecttypeaccount) | `AccountQualifier` | `/v1/BaseAccountQualifier/{id}/FinObjectTypeAccount?by=AccountQualifier` |
| [FinProductAccount](#finproductaccount) | `AccountQualifier` | `/v1/BaseAccountQualifier/{id}/FinProductAccount?by=AccountQualifier` |
| [FinObjectTypeOperationTemplate](#finobjecttypeoperationtemplate) | `DebitAccountQualifier` | `/v1/BaseAccountQualifier/{id}/FinObjectTypeOperationTemplate?by=DebitAccountQualifier` |
| [FinObjectTypeOperationTemplate](#finobjecttypeoperationtemplate) | `CreditAccountQualifier` | `/v1/BaseAccountQualifier/{id}/FinObjectTypeOperationTemplate?by=CreditAccountQualifier` |
| [Document](#document) | `DebitAccountQualifier` | `/v1/BaseAccountQualifier/{id}/Document?by=DebitAccountQualifier` |
| [Document](#document) | `CreditAccountQualifier` | `/v1/BaseAccountQualifier/{id}/Document?by=CreditAccountQualifier` |
| [FinProductAccount](#finproductaccount) | `DefaultAccountQualifier` | `/v1/BaseAccountQualifier/{id}/FinProductAccount?by=DefaultAccountQualifier` |
| [Operation](#operation) | `DebitAccountQualifier` | `/v1/BaseAccountQualifier/{id}/Operation?by=DebitAccountQualifier` |
| [Operation](#operation) | `CreditAccountQualifier` | `/v1/BaseAccountQualifier/{id}/Operation?by=CreditAccountQualifier` |
| [FinObjectOperationTemplate](#finobjectoperationtemplate) | `DebitAccountQualifier` | `/v1/BaseAccountQualifier/{id}/FinObjectOperationTemplate?by=DebitAccountQualifier` |
| [FinObjectOperationTemplate](#finobjectoperationtemplate) | `CreditAccountQualifier` | `/v1/BaseAccountQualifier/{id}/FinObjectOperationTemplate?by=CreditAccountQualifier` |
| [FinObjectTypeLogicalAccountGroupItem](#finobjecttypelogicalaccountgroupitem) | `AccountQualifier` | `/v1/BaseAccountQualifier/{id}/FinObjectTypeLogicalAccountGroupItem?by=AccountQualifier` |
| [InitialBalance](#initialbalance) | `AccountQualifier` | `/v1/BaseAccountQualifier/{id}/InitialBalance?by=AccountQualifier` |
| [AccountQualifierAsFinObject](#accountqualifierasfinobject) | `OID` | `/v1/BaseAccountQualifier/{id}/AccountQualifierAsFinObject?by=OID` |
| [FinObjectTypeDocumentTemplate](#finobjecttypedocumenttemplate) | `DebitAccountQualifier` | `/v1/BaseAccountQualifier/{id}/FinObjectTypeDocumentTemplate?by=DebitAccountQualifier` |
| [FinObjectTypeDocumentTemplate](#finobjecttypedocumenttemplate) | `CreditAccountQualifier` | `/v1/BaseAccountQualifier/{id}/FinObjectTypeDocumentTemplate?by=CreditAccountQualifier` |
| [FinObjectDocumentTemplate](#finobjectdocumenttemplate) | `DebitAccountQualifier` | `/v1/BaseAccountQualifier/{id}/FinObjectDocumentTemplate?by=DebitAccountQualifier` |
| [FinObjectDocumentTemplate](#finobjectdocumenttemplate) | `CreditAccountQualifier` | `/v1/BaseAccountQualifier/{id}/FinObjectDocumentTemplate?by=CreditAccountQualifier` |

## BaseClient

`dbo.BaseClient` · 19 216 qator · PK: OID · 41 ustun

`GET /v1/BaseClient` · `GET /v1/BaseClient/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `TaxOrganisation` | [TaxOrganisation](#taxorganisation) | OID |
| `NationalEconomySector2` | [NationalEconomySector2](#nationaleconomysector2) | OID |
| `ClientType` | [ClientType](#clienttype) | OID |
| `Branch` | [Branch](#branch) | OID |
| `ContactInformation` | [ContactInformation](#contactinformation) | OID |
| `DirectOrgan` | [DirectOrgan](#directorgan) | OID |
| `NationalEconomySector` | [NationalEconomySector](#nationaleconomysector) | OID |
| `PropertyType` | [PropertyType](#propertytype) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `ObjectType` | [XPObjectType](#xpobjecttype) | OID |
| `Affiliation` | [AffiliationType](#affiliationtype) | OID |
| `ClientTypeClassifier` | [ClientTypeClassifier](#clienttypeclassifier) | OID |
| `Address` | [Location](#location) | OID |
| `AddressFactual` | [Location](#location) | OID |
| `Residency` | [ResidencyType](#residencytype) | OID |

Misol: `/v1/BaseClient?expand=TaxOrganisation`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanCollateral](#loancollateral) | `GuarantorToDelete` | `/v1/BaseClient/{id}/LoanCollateral?by=GuarantorToDelete` |
| [IndividualClient](#individualclient) | `OID` | `/v1/BaseClient/{id}/IndividualClient?by=OID` |
| [OperationalAccount](#operationalaccount) | `Client` | `/v1/BaseClient/{id}/OperationalAccount?by=Client` |
| [FinObject](#finobject) | `Client` | `/v1/BaseClient/{id}/FinObject?by=Client` |
| [LegislativeClient](#legislativeclient) | `OID` | `/v1/BaseClient/{id}/LegislativeClient?by=OID` |
| [ClientLicense](#clientlicense) | `Client` | `/v1/BaseClient/{id}/ClientLicense?by=Client` |
| [ClientImageAttachment](#clientimageattachment) | `Client` | `/v1/BaseClient/{id}/ClientImageAttachment?by=Client` |
| [LegislativeClientFounder](#legislativeclientfounder) | `Client` | `/v1/BaseClient/{id}/LegislativeClientFounder?by=Client` |
| [Affiliation_RelationHistory](#affiliation_relationhistory) | `DependentClient` | `/v1/BaseClient/{id}/Affiliation_RelationHistory?by=DependentClient` |
| [Document](#document) | `Client` | `/v1/BaseClient/{id}/Document?by=Client` |
| [LoanApplicationParticipants](#loanapplicationparticipants) | `Client` | `/v1/BaseClient/{id}/LoanApplicationParticipants?by=Client` |
| [Grki_LoanApplicationGrkiRegistartionNumber](#grki_loanapplicationgrkiregistartionnumber) | `Client` | `/v1/BaseClient/{id}/Grki_LoanApplicationGrkiRegistartionNumber?by=Client` |
| [Factoring](#factoring) | `Seller` | `/v1/BaseClient/{id}/Factoring?by=Seller` |
| [ClientBankAccount](#clientbankaccount) | `Client` | `/v1/BaseClient/{id}/ClientBankAccount?by=Client` |
| [GroupClientItem](#groupclientitem) | `Client` | `/v1/BaseClient/{id}/GroupClientItem?by=Client` |
| [Affiliation_Relation](#affiliation_relation) | `InfluentialClient` | `/v1/BaseClient/{id}/Affiliation_Relation?by=InfluentialClient` |
| [GroupClient](#groupclient) | `OID` | `/v1/BaseClient/{id}/GroupClient?by=OID` |
| [Affiliation_Relation](#affiliation_relation) | `DependentClient` | `/v1/BaseClient/{id}/Affiliation_Relation?by=DependentClient` |
| [LoanCollateral](#loancollateral) | `GuarantorOrOwner` | `/v1/BaseClient/{id}/LoanCollateral?by=GuarantorOrOwner` |
| [Affiliation_RelationHistory](#affiliation_relationhistory) | `InfluentialClient` | `/v1/BaseClient/{id}/Affiliation_RelationHistory?by=InfluentialClient` |

## BorrowerType

`dbo.BorrowerType` · 44 qator · PK: OID · 18 ustun

`GET /v1/BorrowerType` · `GET /v1/BorrowerType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `Parent` | [BorrowerType](#borrowertype) | OID |
| `ClientTypeClassifier` | [ClientTypeClassifier](#clienttypeclassifier) | OID |

Misol: `/v1/BorrowerType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanProduct](#loanproduct) | `BorrowerType` | `/v1/BorrowerType/{id}/LoanProduct?by=BorrowerType` |
| [BorrowerType](#borrowertype) | `Parent` | `/v1/BorrowerType/{id}/BorrowerType?by=Parent` |
| [Loan](#loan) | `BorrowerType` | `/v1/BorrowerType/{id}/Loan?by=BorrowerType` |

## Branch

`dbo.Branch` · 14 qator · PK: OID · 17 ustun

`GET /v1/Branch` · `GET /v1/Branch/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/Branch?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BaseClient](#baseclient) | `Branch` | `/v1/Branch/{id}/BaseClient?by=Branch` |
| [isUser](#isuser) | `Branch` | `/v1/Branch/{id}/isUser?by=Branch` |
| [BaseAccount](#baseaccount) | `Branch` | `/v1/Branch/{id}/BaseAccount?by=Branch` |
| [Document](#document) | `Branch` | `/v1/Branch/{id}/Document?by=Branch` |
| [FinProduct](#finproduct) | `Branch` | `/v1/Branch/{id}/FinProduct?by=Branch` |
| [FinObject](#finobject) | `Branch` | `/v1/Branch/{id}/FinObject?by=Branch` |

## CBReportTemplate

`dbo.CBReportTemplate` · 1 qator · PK: OID · 9 ustun

`GET /v1/CBReportTemplate` · `GET /v1/CBReportTemplate/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/CBReportTemplate?expand=GCRecord`

## CalculationMethodProviderFormula

`dbo.CalculationMethodProviderFormula` · 3 qator · PK: OID · 2 ustun

`GET /v1/CalculationMethodProviderFormula` · `GET /v1/CalculationMethodProviderFormula/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [OperationFormula](#operationformula) | OID |

Misol: `/v1/CalculationMethodProviderFormula?expand=OID`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinProduct](#finproduct) | `CalculationMethodProviderFormula` | `/v1/CalculationMethodProviderFormula/{id}/FinProduct?by=CalculationMethodProviderFormula` |

## Calendar

`dbo.Calendar` · 16 437 qator · PK: Date · 4 ustun

`GET /v1/Calendar` · `GET /v1/Calendar/{Date}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## Cert

`dbo.Cert` · 1 qator · PK: OID · 4 ustun

`GET /v1/Cert` · `GET /v1/Cert/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## ClientBankAccount

`dbo.ClientBankAccount` · 1 qator · PK: OID · 13 ustun

`GET /v1/ClientBankAccount` · `GET /v1/ClientBankAccount/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Client` | [BaseClient](#baseclient) | OID |
| `BankBranch` | [BankBranch](#bankbranch) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ClientBankAccount?expand=Client`

## ClientBlackListItem

`dbo.ClientBlackListItem` · 7 721 qator · PK: OID · 15 ustun

`GET /v1/ClientBlackListItem` · `GET /v1/ClientBlackListItem/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ClientBlackListItem?expand=GCRecord`

## ClientImageAttachment

`dbo.ClientImageAttachment` · 0 qator · PK: OID · 12 ustun

`GET /v1/ClientImageAttachment` · `GET /v1/ClientImageAttachment/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Client` | [BaseClient](#baseclient) | OID |
| `ImageAttachmentType` | [ClientImageAttachmentType](#clientimageattachmenttype) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ClientImageAttachment?expand=Client`

## ClientImageAttachmentType

`dbo.ClientImageAttachmentType` · 0 qator · PK: OID · 9 ustun

`GET /v1/ClientImageAttachmentType` · `GET /v1/ClientImageAttachmentType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ClientImageAttachmentType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [ClientImageAttachment](#clientimageattachment) | `ImageAttachmentType` | `/v1/ClientImageAttachmentType/{id}/ClientImageAttachment?by=ImageAttachmentType` |

## ClientLicense

`dbo.ClientLicense` · 1 qator · PK: OID · 20 ustun

`GET /v1/ClientLicense` · `GET /v1/ClientLicense/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Client` | [BaseClient](#baseclient) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ClientLicense?expand=Client`

## ClientType

`dbo.ClientType` · 0 qator · PK: OID · 10 ustun

`GET /v1/ClientType` · `GET /v1/ClientType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ClientType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BaseClient](#baseclient) | `ClientType` | `/v1/ClientType/{id}/BaseClient?by=ClientType` |
| [BalanceAccount](#balanceaccount) | `ClientType` | `/v1/ClientType/{id}/BalanceAccount?by=ClientType` |

## ClientTypeClassifier

`dbo.ClientTypeClassifier` · 14 qator · PK: OID · 18 ustun

`GET /v1/ClientTypeClassifier` · `GET /v1/ClientTypeClassifier/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ClientTypeClassifier?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinProductAllowableFinProducts_ClientTypeClassifierAllowableClientTypeClassifiers](#finproductallowablefinproducts_clienttypeclassifierallowableclienttypeclassifiers) | `AllowableClientTypeClassifiers` | `/v1/ClientTypeClassifier/{id}/FinProductAllowableFinProducts_ClientTypeClassifierAllowableClientTypeClassifiers?by=AllowableClientTypeClassifiers` |
| [BaseClient](#baseclient) | `ClientTypeClassifier` | `/v1/ClientTypeClassifier/{id}/BaseClient?by=ClientTypeClassifier` |
| [LoanCollateral](#loancollateral) | `GuarantorClientTypeClassifierToDelete` | `/v1/ClientTypeClassifier/{id}/LoanCollateral?by=GuarantorClientTypeClassifierToDelete` |
| [FinObject](#finobject) | `ClientTypeClassifier` | `/v1/ClientTypeClassifier/{id}/FinObject?by=ClientTypeClassifier` |
| [BorrowerType](#borrowertype) | `ClientTypeClassifier` | `/v1/ClientTypeClassifier/{id}/BorrowerType?by=ClientTypeClassifier` |

## ClosedIndividualClientPersonalCitizenCode

`dbo.ClosedIndividualClientPersonalCitizenCode` · 29 qator · PK: IndividualClientOid · 3 ustun

`GET /v1/ClosedIndividualClientPersonalCitizenCode` · `GET /v1/ClosedIndividualClientPersonalCitizenCode/{IndividualClientOid}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## CollateralRegistryLegislativeClientSmallBusinessType

`dbo.CollateralRegistryLegislativeClientSmallBusinessType` · 6 qator · PK: OID · 11 ustun

`GET /v1/CollateralRegistryLegislativeClientSmallBusinessType` · `GET /v1/CollateralRegistryLegislativeClientSmallBusinessType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/CollateralRegistryLegislativeClientSmallBusinessType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LegislativeClient](#legislativeclient) | `SmallBusinessType` | `/v1/CollateralRegistryLegislativeClientSmallBusinessType/{id}/LegislativeClient?by=SmallBusinessType` |

## ContactInformation

`dbo.ContactInformation` · 19 325 qator · PK: OID · 10 ustun

`GET /v1/ContactInformation` · `GET /v1/ContactInformation/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ContactInformation?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BaseClient](#baseclient) | `ContactInformation` | `/v1/ContactInformation/{id}/BaseClient?by=ContactInformation` |
| [EMail](#email) | `ContactInformation` | `/v1/ContactInformation/{id}/EMail?by=ContactInformation` |
| [FaxNumber](#faxnumber) | `ContactInformation` | `/v1/ContactInformation/{id}/FaxNumber?by=ContactInformation` |
| [TelephoneNumber](#telephonenumber) | `ContactInformation` | `/v1/ContactInformation/{id}/TelephoneNumber?by=ContactInformation` |

## ContractTemplate

`dbo.ContractTemplate` · 0 qator · PK: OID · 11 ustun

`GET /v1/ContractTemplate` · `GET /v1/ContractTemplate/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ContractTemplate?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinProductAllowableFinProducts_ContractTemplateAllowableContractTemplates](#finproductallowablefinproducts_contracttemplateallowablecontracttemplates) | `AllowableContractTemplates` | `/v1/ContractTemplate/{id}/FinProductAllowableFinProducts_ContractTemplateAllowableContractTemplates?by=AllowableContractTemplates` |

## Country

`dbo.Country` · 251 qator · PK: OID · 18 ustun

`GET /v1/Country` · `GET /v1/Country/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Currency` | [Currency](#currency) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/Country?expand=Currency`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanCollateral](#loancollateral) | `GrkiLocationCountry` | `/v1/Country/{id}/LoanCollateral?by=GrkiLocationCountry` |
| [Location](#location) | `Country` | `/v1/Country/{id}/Location?by=Country` |
| [LoanCollateralRealEstate](#loancollateralrealestate) | `LocationCountry` | `/v1/Country/{id}/LoanCollateralRealEstate?by=LocationCountry` |
| [Bank](#bank) | `Country` | `/v1/Country/{id}/Bank?by=Country` |
| [Region](#region) | `Country` | `/v1/Country/{id}/Region?by=Country` |
| [LoanCollateralVehicle](#loancollateralvehicle) | `ProductionCountry` | `/v1/Country/{id}/LoanCollateralVehicle?by=ProductionCountry` |
| [Passport](#passport) | `RegistrationCountry` | `/v1/Country/{id}/Passport?by=RegistrationCountry` |

## Currency

`dbo.Currency` · 212 qator · PK: OID · 16 ustun

`GET /v1/Currency` · `GET /v1/Currency/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/Currency?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinObject](#finobject) | `Currency` | `/v1/Currency/{id}/FinObject?by=Currency` |
| [CurrencyRate](#currencyrate) | `Currency` | `/v1/Currency/{id}/CurrencyRate?by=Currency` |
| [FinProduct](#finproduct) | `Currency` | `/v1/Currency/{id}/FinProduct?by=Currency` |
| [Country](#country) | `Currency` | `/v1/Currency/{id}/Country?by=Currency` |
| [OperationalAccount](#operationalaccount) | `Currency` | `/v1/Currency/{id}/OperationalAccount?by=Currency` |
| [LoanCollateral](#loancollateral) | `Currency` | `/v1/Currency/{id}/LoanCollateral?by=Currency` |

## CurrencyRate

`dbo.CurrencyRate` · 0 qator · PK: OID · 11 ustun

`GET /v1/CurrencyRate` · `GET /v1/CurrencyRate/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Currency` | [Currency](#currency) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/CurrencyRate?expand=Currency`

## CustomFinObject

`dbo.CustomFinObject` · 111 qator · PK: OID · 2 ustun

`GET /v1/CustomFinObject` · `GET /v1/CustomFinObject/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [FinObject](#finobject) | OID |

Misol: `/v1/CustomFinObject?expand=OID`

## CustomFinProduct

`dbo.CustomFinProduct` · 4 qator · PK: OID · 2 ustun

`GET /v1/CustomFinProduct` · `GET /v1/CustomFinProduct/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [FinProduct](#finproduct) | OID |

Misol: `/v1/CustomFinProduct?expand=OID`

## Deposit

`dbo.Deposit` · 0 qator · PK: OID · 4 ustun

`GET /v1/Deposit` · `GET /v1/Deposit/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [FinObject](#finobject) | OID |
| `DepositType` | [DepositType](#deposittype) | OID |

Misol: `/v1/Deposit?expand=OID`

## DepositProduct

`dbo.DepositProduct` · 0 qator · PK: OID · 3 ustun

`GET /v1/DepositProduct` · `GET /v1/DepositProduct/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [FinProduct](#finproduct) | OID |
| `DepositType` | [DepositType](#deposittype) | OID |

Misol: `/v1/DepositProduct?expand=OID`

## DepositType

`dbo.DepositType` · 4 qator · PK: OID · 15 ustun

`GET /v1/DepositType` · `GET /v1/DepositType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/DepositType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Deposit](#deposit) | `DepositType` | `/v1/DepositType/{id}/Deposit?by=DepositType` |
| [DepositProduct](#depositproduct) | `DepositType` | `/v1/DepositType/{id}/DepositProduct?by=DepositType` |

## DirectOrgan

`dbo.DirectOrgan` · 439 qator · PK: OID · 15 ustun

`GET /v1/DirectOrgan` · `GET /v1/DirectOrgan/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/DirectOrgan?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BaseClient](#baseclient) | `DirectOrgan` | `/v1/DirectOrgan/{id}/BaseClient?by=DirectOrgan` |
| [LoanCollateralGuarantee](#loancollateralguarantee) | `GuarantorDirectOrganToDelete` | `/v1/DirectOrgan/{id}/LoanCollateralGuarantee?by=GuarantorDirectOrganToDelete` |

## District

`dbo.District` · 230 qator · PK: OID · 16 ustun

`GET /v1/District` · `GET /v1/District/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Region` | [Region](#region) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/District?expand=Region`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanCollateral](#loancollateral) | `GrkiLocationDistrict` | `/v1/District/{id}/LoanCollateral?by=GrkiLocationDistrict` |
| [LoanCollateralRealEstate](#loancollateralrealestate) | `LocationDistrict` | `/v1/District/{id}/LoanCollateralRealEstate?by=LocationDistrict` |
| [BankBranch](#bankbranch) | `District` | `/v1/District/{id}/BankBranch?by=District` |
| [Location](#location) | `District` | `/v1/District/{id}/Location?by=District` |
| [Mahalla](#mahalla) | `District` | `/v1/District/{id}/Mahalla?by=District` |
| [Passport](#passport) | `RegistrationDistrict` | `/v1/District/{id}/Passport?by=RegistrationDistrict` |

## Document

`dbo.Document` · 5 803 203 qator · PK: OID · 19 ustun

`GET /v1/Document` · `GET /v1/Document/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `DebitAccount` | [OperationalAccount](#operationalaccount) | OID |
| `CreditAccount` | [OperationalAccount](#operationalaccount) | OID |
| `DebitAccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `CreditAccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `Client` | [BaseClient](#baseclient) | OID |
| `Branch` | [Branch](#branch) | OID |
| `Creator` | [isUser](#isuser) | OID |
| `Template` | [FinObjectDocumentTemplate](#finobjectdocumenttemplate) | OID |
| `DocumentState` | [DocumentState](#documentstate) | OID |

Misol: `/v1/Document?expand=DebitAccount`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [DocumentState](#documentstate) | `Document` | `/v1/Document/{id}/DocumentState?by=Document` |
| [Operation](#operation) | `Document` | `/v1/Document/{id}/Operation?by=Document` |

## DocumentAmountFormula

`dbo.DocumentAmountFormula` · 26 qator · PK: OID · 2 ustun

`GET /v1/DocumentAmountFormula` · `GET /v1/DocumentAmountFormula/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [OperationFormula](#operationformula) | OID |

Misol: `/v1/DocumentAmountFormula?expand=OID`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinObjectTypeDocumentTemplate](#finobjecttypedocumenttemplate) | `AmountFormula` | `/v1/DocumentAmountFormula/{id}/FinObjectTypeDocumentTemplate?by=AmountFormula` |
| [FinProductDocumentTemplate](#finproductdocumenttemplate) | `AmountFormula` | `/v1/DocumentAmountFormula/{id}/FinProductDocumentTemplate?by=AmountFormula` |

## DocumentDateFormula

`dbo.DocumentDateFormula` · 8 qator · PK: OID · 2 ustun

`GET /v1/DocumentDateFormula` · `GET /v1/DocumentDateFormula/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [OperationFormula](#operationformula) | OID |

Misol: `/v1/DocumentDateFormula?expand=OID`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinObjectTypeDocumentTemplate](#finobjecttypedocumenttemplate) | `DateFormula` | `/v1/DocumentDateFormula/{id}/FinObjectTypeDocumentTemplate?by=DateFormula` |
| [FinProductDocumentTemplate](#finproductdocumenttemplate) | `DateFormula` | `/v1/DocumentDateFormula/{id}/FinProductDocumentTemplate?by=DateFormula` |

## DocumentNumerationFormula

`dbo.DocumentNumerationFormula` · 1 qator · PK: OID · 2 ustun

`GET /v1/DocumentNumerationFormula` · `GET /v1/DocumentNumerationFormula/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [OperationFormula](#operationformula) | OID |

Misol: `/v1/DocumentNumerationFormula?expand=OID`

## DocumentState

`dbo.DocumentState` · 6 518 524 qator · PK: OID · 10 ustun

`GET /v1/DocumentState` · `GET /v1/DocumentState/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Document` | [Document](#document) | OID |
| `DocumentStateCategory` | [DocumentStateCategory](#documentstatecategory) | OID |
| `User` | [isUser](#isuser) | OID |
| `PreviousDocumentState` | [DocumentState](#documentstate) | OID |

Misol: `/v1/DocumentState?expand=Document`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [DocumentState](#documentstate) | `PreviousDocumentState` | `/v1/DocumentState/{id}/DocumentState?by=PreviousDocumentState` |
| [Document](#document) | `DocumentState` | `/v1/DocumentState/{id}/Document?by=DocumentState` |

## DocumentStateCategory

`dbo.DocumentStateCategory` · 5 qator · PK: OID · 10 ustun

`GET /v1/DocumentStateCategory` · `GET /v1/DocumentStateCategory/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [DocumentState](#documentstate) | `DocumentStateCategory` | `/v1/DocumentStateCategory/{id}/DocumentState?by=DocumentStateCategory` |
| [DocumentStateChangeAction](#documentstatechangeaction) | `CurrentStateCategory` | `/v1/DocumentStateCategory/{id}/DocumentStateChangeAction?by=CurrentStateCategory` |
| [DocumentStateChangeAction](#documentstatechangeaction) | `NewStateCategory` | `/v1/DocumentStateCategory/{id}/DocumentStateChangeAction?by=NewStateCategory` |

## DocumentStateChangeAction

`dbo.DocumentStateChangeAction` · 4 qator · PK: OID · 13 ustun

`GET /v1/DocumentStateChangeAction` · `GET /v1/DocumentStateChangeAction/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `CurrentStateCategory` | [DocumentStateCategory](#documentstatecategory) | OID |
| `NewStateCategory` | [DocumentStateCategory](#documentstatecategory) | OID |

Misol: `/v1/DocumentStateChangeAction?expand=CurrentStateCategory`

## EMail

`dbo.EMail` · 1 qator · PK: OID · 10 ustun

`GET /v1/EMail` · `GET /v1/EMail/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `ContactInformation` | [ContactInformation](#contactinformation) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/EMail?expand=ContactInformation`

## ETLLastProcessedRecordID

`dbo.ETLLastProcessedRecordID` · 3 qator · PK: yo'q · 3 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/dbo.ETLLastProcessedRecordID`.

## EducationType

`dbo.EducationType` · 5 qator · PK: OID · 9 ustun

`GET /v1/EducationType` · `GET /v1/EducationType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/EducationType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Person](#person) | `Education` | `/v1/EducationType/{id}/Person?by=Education` |

## Employee

`dbo.Employee` · 0 qator · PK: OID · 9 ustun

`GET /v1/Employee` · `GET /v1/Employee/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/Employee?expand=GCRecord`

## Factoring

`dbo.Factoring` · 0 qator · PK: OID · 7 ustun

`GET /v1/Factoring` · `GET /v1/Factoring/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `DirectionType` | [GrkiFactoringDirectionType](#grkifactoringdirectiontype) | OID |
| `Type` | [GrkiFactoringType](#grkifactoringtype) | OID |
| `Seller` | [BaseClient](#baseclient) | OID |
| `RegressType` | [GrkiFactoringRegressType](#grkifactoringregresstype) | OID |
| `ParticipationType` | [GrkiFactoringParticipationType](#grkifactoringparticipationtype) | OID |
| `DisclosureType` | [GrkiFactoringDisclosureType](#grkifactoringdisclosuretype) | OID |
| `OID` | [FinObject](#finobject) | OID |

Misol: `/v1/Factoring?expand=DirectionType`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FactoringInvoiceRegistry](#factoringinvoiceregistry) | `Factoring` | `/v1/Factoring/{id}/FactoringInvoiceRegistry?by=Factoring` |

## FactoringInvoice

`dbo.FactoringInvoice` · 0 qator · PK: OID · 13 ustun

`GET /v1/FactoringInvoice` · `GET /v1/FactoringInvoice/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `InvoiceRegistry` | [FactoringInvoiceRegistry](#factoringinvoiceregistry) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/FactoringInvoice?expand=InvoiceRegistry`

## FactoringInvoiceRegistry

`dbo.FactoringInvoiceRegistry` · 0 qator · PK: OID · 2 ustun

`GET /v1/FactoringInvoiceRegistry` · `GET /v1/FactoringInvoiceRegistry/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Factoring` | [Factoring](#factoring) | OID |
| `OID` | [FinObject](#finobject) | OID |

Misol: `/v1/FactoringInvoiceRegistry?expand=Factoring`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FactoringInvoice](#factoringinvoice) | `InvoiceRegistry` | `/v1/FactoringInvoiceRegistry/{id}/FactoringInvoice?by=InvoiceRegistry` |

## FaxNumber

`dbo.FaxNumber` · 8 qator · PK: OID · 10 ustun

`GET /v1/FaxNumber` · `GET /v1/FaxNumber/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `ContactInformation` | [ContactInformation](#contactinformation) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/FaxNumber?expand=ContactInformation`

## FinObject

`dbo.FinObject` · 37 251 qator · PK: OID · 36 ustun

`GET /v1/FinObject` · `GET /v1/FinObject/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Client` | [BaseClient](#baseclient) | OID |
| `Currency` | [Currency](#currency) | OID |
| `Group` | [GroupClientItem](#groupclientitem) | OID |
| `Branch` | [Branch](#branch) | OID |
| `FinProduct` | [FinProduct](#finproduct) | OID |
| `InterestRateFormula` | [InterestRateFormula](#interestrateformula) | OID |
| `CalculationMethodProviderFormula` | [OperationFormula](#operationformula) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `ObjectType` | [XPObjectType](#xpobjecttype) | OID |
| `PaymentType` | [PaymentType](#paymenttype) | OID |
| `ClientTypeClassifier` | [ClientTypeClassifier](#clienttypeclassifier) | OID |

Misol: `/v1/FinObject?expand=Client`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [OperationClassification](#operationclassification) | `FinObject` | `/v1/FinObject/{id}/OperationClassification?by=FinObject` |
| [AccountQualifierAsFinObject](#accountqualifierasfinobject) | `FinObject` | `/v1/FinObject/{id}/AccountQualifierAsFinObject?by=FinObject` |
| [CustomFinObject](#customfinobject) | `OID` | `/v1/FinObject/{id}/CustomFinObject?by=OID` |
| [FinObjectDocumentTemplate](#finobjectdocumenttemplate) | `FinObject` | `/v1/FinObject/{id}/FinObjectDocumentTemplate?by=FinObject` |
| [FinObjectExtendedProperty](#finobjectextendedproperty) | `Owner` | `/v1/FinObject/{id}/FinObjectExtendedProperty?by=Owner` |
| [FinObjectAccount](#finobjectaccount) | `FinObject` | `/v1/FinObject/{id}/FinObjectAccount?by=FinObject` |
| [LoanApplication](#loanapplication) | `OID` | `/v1/FinObject/{id}/LoanApplication?by=OID` |
| [Factoring](#factoring) | `OID` | `/v1/FinObject/{id}/Factoring?by=OID` |
| [FactoringInvoiceRegistry](#factoringinvoiceregistry) | `OID` | `/v1/FinObject/{id}/FactoringInvoiceRegistry?by=OID` |
| [Share](#share) | `OID` | `/v1/FinObject/{id}/Share?by=OID` |
| [Deposit](#deposit) | `OID` | `/v1/FinObject/{id}/Deposit?by=OID` |
| [Loan](#loan) | `OID` | `/v1/FinObject/{id}/Loan?by=OID` |

## FinObjectAccount

`dbo.FinObjectAccount` · 1 095 314 qator · PK: OID · 15 ustun

`GET /v1/FinObjectAccount` · `GET /v1/FinObjectAccount/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Account` | [OperationalAccount](#operationalaccount) | OID |
| `Parent` | [FinProductAccount](#finproductaccount) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `FinObject` | [FinObject](#finobject) | OID |
| `DefaultAccount` | [BaseAccount](#baseaccount) | OID |

Misol: `/v1/FinObjectAccount?expand=Account`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [OperationalAccount](#operationalaccount) | `FinObjectAccount` | `/v1/FinObjectAccount/{id}/OperationalAccount?by=FinObjectAccount` |

## FinObjectAttachment

`dbo.FinObjectAttachment` · 0 qator · PK: OID · 13 ustun

`GET /v1/FinObjectAttachment` · `GET /v1/FinObjectAttachment/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/FinObjectAttachment?expand=GCRecord`

## FinObjectDocumentTemplate

`dbo.FinObjectDocumentTemplate` · 1 667 302 qator · PK: OID · 24 ustun

`GET /v1/FinObjectDocumentTemplate` · `GET /v1/FinObjectDocumentTemplate/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `DebitAccount` | [OperationalAccount](#operationalaccount) | OID |
| `CreditAccount` | [OperationalAccount](#operationalaccount) | OID |
| `DebitAccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `CreditAccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `AvailabilityFormula` | [TemplateAvailabilityFormula](#templateavailabilityformula) | OID |
| `Parent` | [FinProductDocumentTemplate](#finproductdocumenttemplate) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `FinObject` | [FinObject](#finobject) | OID |

Misol: `/v1/FinObjectDocumentTemplate?expand=DebitAccount`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinObjectOperationTemplate](#finobjectoperationtemplate) | `DocumentTemplate` | `/v1/FinObjectDocumentTemplate/{id}/FinObjectOperationTemplate?by=DocumentTemplate` |
| [Document](#document) | `Template` | `/v1/FinObjectDocumentTemplate/{id}/Document?by=Template` |

## FinObjectExtendedProperty

`dbo.FinObjectExtendedProperty` · 625 302 qator · PK: OID · 13 ustun

`GET /v1/FinObjectExtendedProperty` · `GET /v1/FinObjectExtendedProperty/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Parent` | [FinProductExtendedProperty](#finproductextendedproperty) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `Owner` | [FinObject](#finobject) | OID |

Misol: `/v1/FinObjectExtendedProperty?expand=Parent`

## FinObjectNumerator

`dbo.FinObjectNumerator` · 0 qator · PK: FinObjectType, Client · 3 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## FinObjectOperationTemplate

`dbo.FinObjectOperationTemplate` · 5 210 077 qator · PK: OID · 21 ustun

`GET /v1/FinObjectOperationTemplate` · `GET /v1/FinObjectOperationTemplate/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `DebitAccount` | [OperationalAccount](#operationalaccount) | OID |
| `CreditAccount` | [OperationalAccount](#operationalaccount) | OID |
| `DebitAccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `CreditAccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `Parent` | [FinProductOperationTemplate](#finproductoperationtemplate) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `DocumentTemplate` | [FinObjectDocumentTemplate](#finobjectdocumenttemplate) | OID |

Misol: `/v1/FinObjectOperationTemplate?expand=DebitAccount`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Operation](#operation) | `Template` | `/v1/FinObjectOperationTemplate/{id}/Operation?by=Template` |

## FinObjectType

`dbo.FinObjectType` · 12 qator · PK: OID · 25 ustun

`GET /v1/FinObjectType` · `GET /v1/FinObjectType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/FinObjectType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BalanceAccount](#balanceaccount) | `OwnerType` | `/v1/FinObjectType/{id}/BalanceAccount?by=OwnerType` |
| [ScheduleConfiguration](#scheduleconfiguration) | `FinObjectType` | `/v1/FinObjectType/{id}/ScheduleConfiguration?by=FinObjectType` |
| [FinObjectTypeAccount](#finobjecttypeaccount) | `FinObjectType` | `/v1/FinObjectType/{id}/FinObjectTypeAccount?by=FinObjectType` |
| [FinProduct](#finproduct) | `FinObjectType` | `/v1/FinObjectType/{id}/FinProduct?by=FinObjectType` |
| [FinObjectTypeLogicalAccountGroup](#finobjecttypelogicalaccountgroup) | `FinObjectType` | `/v1/FinObjectType/{id}/FinObjectTypeLogicalAccountGroup?by=FinObjectType` |
| [FinObjectTypeDocumentTemplate](#finobjecttypedocumenttemplate) | `FinObjectType` | `/v1/FinObjectType/{id}/FinObjectTypeDocumentTemplate?by=FinObjectType` |
| [FinObjectTypeExtendedProperty](#finobjecttypeextendedproperty) | `Owner` | `/v1/FinObjectType/{id}/FinObjectTypeExtendedProperty?by=Owner` |
| [OperationClassificationRule](#operationclassificationrule) | `FinObjectType` | `/v1/FinObjectType/{id}/OperationClassificationRule?by=FinObjectType` |

## FinObjectTypeAccount

`dbo.FinObjectTypeAccount` · 129 qator · PK: OID · 18 ustun

`GET /v1/FinObjectTypeAccount` · `GET /v1/FinObjectTypeAccount/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `FinObjectType` | [FinObjectType](#finobjecttype) | OID |
| `AccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `AccountQualifierType` | [AccountQualifierType](#accountqualifiertype) | OID |

Misol: `/v1/FinObjectTypeAccount?expand=FinObjectType`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BalanceAccountToFinObjectTypeAccountBinding](#balanceaccounttofinobjecttypeaccountbinding) | `FinObjectTypeAccount` | `/v1/FinObjectTypeAccount/{id}/BalanceAccountToFinObjectTypeAccountBinding?by=FinObjectTypeAccount` |
| [FinObjectTypeOperationTemplate](#finobjecttypeoperationtemplate) | `DebitLogicalAccount` | `/v1/FinObjectTypeAccount/{id}/FinObjectTypeOperationTemplate?by=DebitLogicalAccount` |
| [FinObjectTypeOperationTemplate](#finobjecttypeoperationtemplate) | `CreditLogicalAccount` | `/v1/FinObjectTypeAccount/{id}/FinObjectTypeOperationTemplate?by=CreditLogicalAccount` |
| [FinProductAccount](#finproductaccount) | `Parent` | `/v1/FinObjectTypeAccount/{id}/FinProductAccount?by=Parent` |
| [FinObjectTypeDocumentTemplate](#finobjecttypedocumenttemplate) | `DebitLogicalAccount` | `/v1/FinObjectTypeAccount/{id}/FinObjectTypeDocumentTemplate?by=DebitLogicalAccount` |
| [FinObjectTypeDocumentTemplate](#finobjecttypedocumenttemplate) | `CreditLogicalAccount` | `/v1/FinObjectTypeAccount/{id}/FinObjectTypeDocumentTemplate?by=CreditLogicalAccount` |
| [FinObjectTypeLogicalAccountGroupItem](#finobjecttypelogicalaccountgroupitem) | `Account` | `/v1/FinObjectTypeAccount/{id}/FinObjectTypeLogicalAccountGroupItem?by=Account` |

## FinObjectTypeAccountFinObjectTypeAccounts_BalanceAccountBalanceAccounts

`dbo.FinObjectTypeAccountFinObjectTypeAccounts_BalanceAccountBalanceAccounts` · 0 qator · PK: OID · 5 ustun

`GET /v1/FinObjectTypeAccountFinObjectTypeAccounts_BalanceAccountBalanceAccounts` · `GET /v1/FinObjectTypeAccountFinObjectTypeAccounts_BalanceAccountBalanceAccounts/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## FinObjectTypeDocumentTemplate

`dbo.FinObjectTypeDocumentTemplate` · 177 qator · PK: OID · 33 ustun

`GET /v1/FinObjectTypeDocumentTemplate` · `GET /v1/FinObjectTypeDocumentTemplate/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `FinObjectType` | [FinObjectType](#finobjecttype) | OID |
| `DebitAccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `CreditAccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `DebitLogicalAccount` | [FinObjectTypeAccount](#finobjecttypeaccount) | OID |
| `CreditLogicalAccount` | [FinObjectTypeAccount](#finobjecttypeaccount) | OID |
| `DateFormula` | [DocumentDateFormula](#documentdateformula) | OID |
| `AmountFormula` | [DocumentAmountFormula](#documentamountformula) | OID |
| `AvailabilityFormula` | [TemplateAvailabilityFormula](#templateavailabilityformula) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/FinObjectTypeDocumentTemplate?expand=FinObjectType`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinProductDocumentTemplate](#finproductdocumenttemplate) | `Parent` | `/v1/FinObjectTypeDocumentTemplate/{id}/FinProductDocumentTemplate?by=Parent` |
| [FinObjectTypeOperationTemplate](#finobjecttypeoperationtemplate) | `DocumentTemplate` | `/v1/FinObjectTypeDocumentTemplate/{id}/FinObjectTypeOperationTemplate?by=DocumentTemplate` |
| [OperationFormulaCompatibleFormulas_FinObjectTypeDocumentTemplateCompatibleDocumentTemplates](#operationformulacompatibleformulas_finobjecttypedocumenttemplatecompatibledocumenttemplates) | `CompatibleDocumentTemplates` | `/v1/FinObjectTypeDocumentTemplate/{id}/OperationFormulaCompatibleFormulas_FinObjectTypeDocumentTemplateCompatibleDocumentTemplates?by=CompatibleDocumentTemplates` |
| [OperationClassificationRule](#operationclassificationrule) | `FinObjectTypeDocumentTemplate` | `/v1/FinObjectTypeDocumentTemplate/{id}/OperationClassificationRule?by=FinObjectTypeDocumentTemplate` |

## FinObjectTypeExtendedProperty

`dbo.FinObjectTypeExtendedProperty` · 70 qator · PK: OID · 17 ustun

`GET /v1/FinObjectTypeExtendedProperty` · `GET /v1/FinObjectTypeExtendedProperty/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Owner` | [FinObjectType](#finobjecttype) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/FinObjectTypeExtendedProperty?expand=Owner`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinProductExtendedProperty](#finproductextendedproperty) | `Parent` | `/v1/FinObjectTypeExtendedProperty/{id}/FinProductExtendedProperty?by=Parent` |

## FinObjectTypeLogicalAccountGroup

`dbo.FinObjectTypeLogicalAccountGroup` · 17 qator · PK: OID · 11 ustun

`GET /v1/FinObjectTypeLogicalAccountGroup` · `GET /v1/FinObjectTypeLogicalAccountGroup/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `FinObjectType` | [FinObjectType](#finobjecttype) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/FinObjectTypeLogicalAccountGroup?expand=FinObjectType`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [OperationClassificationRule](#operationclassificationrule) | `CreditLogicalAccountGroup` | `/v1/FinObjectTypeLogicalAccountGroup/{id}/OperationClassificationRule?by=CreditLogicalAccountGroup` |
| [OperationClassificationRule](#operationclassificationrule) | `DebitLogicalAccountGroup` | `/v1/FinObjectTypeLogicalAccountGroup/{id}/OperationClassificationRule?by=DebitLogicalAccountGroup` |
| [FinObjectTypeLogicalAccountGroupItem](#finobjecttypelogicalaccountgroupitem) | `Group` | `/v1/FinObjectTypeLogicalAccountGroup/{id}/FinObjectTypeLogicalAccountGroupItem?by=Group` |

## FinObjectTypeLogicalAccountGroupItem

`dbo.FinObjectTypeLogicalAccountGroupItem` · 28 qator · PK: OID · 12 ustun

`GET /v1/FinObjectTypeLogicalAccountGroupItem` · `GET /v1/FinObjectTypeLogicalAccountGroupItem/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `AccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `Account` | [FinObjectTypeAccount](#finobjecttypeaccount) | OID |
| `Group` | [FinObjectTypeLogicalAccountGroup](#finobjecttypelogicalaccountgroup) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/FinObjectTypeLogicalAccountGroupItem?expand=AccountQualifier`

## FinObjectTypeOperationTemplate

`dbo.FinObjectTypeOperationTemplate` · 540 qator · PK: OID · 22 ustun

`GET /v1/FinObjectTypeOperationTemplate` · `GET /v1/FinObjectTypeOperationTemplate/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `DebitAccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `CreditAccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `DebitLogicalAccount` | [FinObjectTypeAccount](#finobjecttypeaccount) | OID |
| `CreditLogicalAccount` | [FinObjectTypeAccount](#finobjecttypeaccount) | OID |
| `AmountFormula` | [OperationAmountFormula](#operationamountformula) | OID |
| `DocumentTemplate` | [FinObjectTypeDocumentTemplate](#finobjecttypedocumenttemplate) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `DescriptionFormula` | [OperationDescriptionFormula](#operationdescriptionformula) | OID |

Misol: `/v1/FinObjectTypeOperationTemplate?expand=DebitAccountQualifier`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [OperationFormulaCompatibleFormulas_FinObjectTypeOperationTemplateCompatibleOperationTemplates](#operationformulacompatibleformulas_finobjecttypeoperationtemplatecompatibleoperationtemplates) | `CompatibleOperationTemplates` | `/v1/FinObjectTypeOperationTemplate/{id}/OperationFormulaCompatibleFormulas_FinObjectTypeOperationTemplateCompatibleOperationTemplates?by=CompatibleOperationTemplates` |
| [FinProductOperationTemplate](#finproductoperationtemplate) | `Parent` | `/v1/FinObjectTypeOperationTemplate/{id}/FinProductOperationTemplate?by=Parent` |

## FinProduct

`dbo.FinProduct` · 21 qator · PK: OID · 23 ustun

`GET /v1/FinProduct` · `GET /v1/FinProduct/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `FinObjectType` | [FinObjectType](#finobjecttype) | OID |
| `CalculationMethodProviderFormula` | [CalculationMethodProviderFormula](#calculationmethodproviderformula) | OID |
| `Currency` | [Currency](#currency) | OID |
| `Branch` | [Branch](#branch) | OID |
| `InterestRateFormula` | [InterestRateFormula](#interestrateformula) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `ObjectType` | [XPObjectType](#xpobjecttype) | OID |
| `PaymentType` | [PaymentType](#paymenttype) | OID |

Misol: `/v1/FinProduct?expand=FinObjectType`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinProductAllowableFinProducts_ContractTemplateAllowableContractTemplates](#finproductallowablefinproducts_contracttemplateallowablecontracttemplates) | `AllowableFinProducts` | `/v1/FinProduct/{id}/FinProductAllowableFinProducts_ContractTemplateAllowableContractTemplates?by=AllowableFinProducts` |
| [LoanApplicationProduct](#loanapplicationproduct) | `OID` | `/v1/FinProduct/{id}/LoanApplicationProduct?by=OID` |
| [ShareProduct](#shareproduct) | `OID` | `/v1/FinProduct/{id}/ShareProduct?by=OID` |
| [FinProductExtendedProperty](#finproductextendedproperty) | `Owner` | `/v1/FinProduct/{id}/FinProductExtendedProperty?by=Owner` |
| [DepositProduct](#depositproduct) | `OID` | `/v1/FinProduct/{id}/DepositProduct?by=OID` |
| [FinProductAccount](#finproductaccount) | `FinProduct` | `/v1/FinProduct/{id}/FinProductAccount?by=FinProduct` |
| [FinProductDocumentTemplate](#finproductdocumenttemplate) | `FinProduct` | `/v1/FinProduct/{id}/FinProductDocumentTemplate?by=FinProduct` |
| [FinObject](#finobject) | `FinProduct` | `/v1/FinProduct/{id}/FinObject?by=FinProduct` |
| [CustomFinProduct](#customfinproduct) | `OID` | `/v1/FinProduct/{id}/CustomFinProduct?by=OID` |
| [LoanProduct](#loanproduct) | `OID` | `/v1/FinProduct/{id}/LoanProduct?by=OID` |
| [FinProductPolicy](#finproductpolicy) | `FinProduct` | `/v1/FinProduct/{id}/FinProductPolicy?by=FinProduct` |
| [FinProductAllowableFinProducts_ClientTypeClassifierAllowableClientTypeClassifiers](#finproductallowablefinproducts_clienttypeclassifierallowableclienttypeclassifiers) | `AllowableFinProducts` | `/v1/FinProduct/{id}/FinProductAllowableFinProducts_ClientTypeClassifierAllowableClientTypeClassifiers?by=AllowableFinProducts` |

## FinProductAccount

`dbo.FinProductAccount` · 1 172 qator · PK: OID · 15 ustun

`GET /v1/FinProductAccount` · `GET /v1/FinProductAccount/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `AccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `DefaultAccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `Parent` | [FinObjectTypeAccount](#finobjecttypeaccount) | OID |
| `FinProduct` | [FinProduct](#finproduct) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `Account` | [BaseAccount](#baseaccount) | OID |
| `DefaultAccount` | [BaseAccount](#baseaccount) | OID |

Misol: `/v1/FinProductAccount?expand=AccountQualifier`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinObjectAccount](#finobjectaccount) | `Parent` | `/v1/FinProductAccount/{id}/FinObjectAccount?by=Parent` |

## FinProductAllowableFinProducts_ClientTypeClassifierAllowableClientTypeClassifiers

`dbo.FinProductAllowableFinProducts_ClientTypeClassifierAllowableClientTypeClassifiers` · 30 qator · PK: OID · 5 ustun

`GET /v1/FinProductAllowableFinProducts_ClientTypeClassifierAllowableClientTypeClassifiers` · `GET /v1/FinProductAllowableFinProducts_ClientTypeClassifierAllowableClientTypeClassifiers/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `AllowableFinProducts` | [FinProduct](#finproduct) | OID |
| `AllowableClientTypeClassifiers` | [ClientTypeClassifier](#clienttypeclassifier) | OID |

Misol: `/v1/FinProductAllowableFinProducts_ClientTypeClassifierAllowableClientTypeClassifiers?expand=AllowableFinProducts`

## FinProductAllowableFinProducts_ContractTemplateAllowableContractTemplates

`dbo.FinProductAllowableFinProducts_ContractTemplateAllowableContractTemplates` · 0 qator · PK: OID · 5 ustun

`GET /v1/FinProductAllowableFinProducts_ContractTemplateAllowableContractTemplates` · `GET /v1/FinProductAllowableFinProducts_ContractTemplateAllowableContractTemplates/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `AllowableContractTemplates` | [ContractTemplate](#contracttemplate) | OID |
| `AllowableFinProducts` | [FinProduct](#finproduct) | OID |

Misol: `/v1/FinProductAllowableFinProducts_ContractTemplateAllowableContractTemplates?expand=AllowableContractTemplates`

## FinProductDocumentTemplate

`dbo.FinProductDocumentTemplate` · 1 756 qator · PK: OID · 25 ustun

`GET /v1/FinProductDocumentTemplate` · `GET /v1/FinProductDocumentTemplate/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `DateFormula` | [DocumentDateFormula](#documentdateformula) | OID |
| `AmountFormula` | [DocumentAmountFormula](#documentamountformula) | OID |
| `FinProduct` | [FinProduct](#finproduct) | OID |
| `Parent` | [FinObjectTypeDocumentTemplate](#finobjecttypedocumenttemplate) | OID |
| `AvailabilityFormula` | [TemplateAvailabilityFormula](#templateavailabilityformula) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/FinProductDocumentTemplate?expand=DateFormula`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinProductOperationTemplate](#finproductoperationtemplate) | `DocumentTemplate` | `/v1/FinProductDocumentTemplate/{id}/FinProductOperationTemplate?by=DocumentTemplate` |
| [FinObjectDocumentTemplate](#finobjectdocumenttemplate) | `Parent` | `/v1/FinProductDocumentTemplate/{id}/FinObjectDocumentTemplate?by=Parent` |

## FinProductExtendedProperty

`dbo.FinProductExtendedProperty` · 647 qator · PK: OID · 12 ustun

`GET /v1/FinProductExtendedProperty` · `GET /v1/FinProductExtendedProperty/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Owner` | [FinProduct](#finproduct) | OID |
| `Parent` | [FinObjectTypeExtendedProperty](#finobjecttypeextendedproperty) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/FinProductExtendedProperty?expand=Owner`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinObjectExtendedProperty](#finobjectextendedproperty) | `Parent` | `/v1/FinProductExtendedProperty/{id}/FinObjectExtendedProperty?by=Parent` |

## FinProductOperationTemplate

`dbo.FinProductOperationTemplate` · 6 663 qator · PK: OID · 15 ustun

`GET /v1/FinProductOperationTemplate` · `GET /v1/FinProductOperationTemplate/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `AmountFormula` | [OperationAmountFormula](#operationamountformula) | OID |
| `Parent` | [FinObjectTypeOperationTemplate](#finobjecttypeoperationtemplate) | OID |
| `DocumentTemplate` | [FinProductDocumentTemplate](#finproductdocumenttemplate) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/FinProductOperationTemplate?expand=AmountFormula`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinObjectOperationTemplate](#finobjectoperationtemplate) | `Parent` | `/v1/FinProductOperationTemplate/{id}/FinObjectOperationTemplate?by=Parent` |

## FinProductPolicy

`dbo.FinProductPolicy` · 20 qator · PK: OID · 28 ustun

`GET /v1/FinProductPolicy` · `GET /v1/FinProductPolicy/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `FinProduct` | [FinProduct](#finproduct) | OID |
| `PaymentType` | [PaymentType](#paymenttype) | OID |

Misol: `/v1/FinProductPolicy?expand=FinProduct`

## GlobalVariable

`dbo.GlobalVariable` · 3 qator · PK: OID · 14 ustun

`GET /v1/GlobalVariable` · `GET /v1/GlobalVariable/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/GlobalVariable?expand=GCRecord`

## GrkiBorrowerActivityType

`dbo.GrkiBorrowerActivityType` · 4 qator · PK: OID · 8 ustun

`GET /v1/GrkiBorrowerActivityType` · `GET /v1/GrkiBorrowerActivityType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/GrkiBorrowerActivityType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanApplication](#loanapplication) | `GrkiBorrowerActivityType` | `/v1/GrkiBorrowerActivityType/{id}/LoanApplication?by=GrkiBorrowerActivityType` |

## GrkiBorrowerIncomeSourceType

`dbo.GrkiBorrowerIncomeSourceType` · 8 qator · PK: OID · 8 ustun

`GET /v1/GrkiBorrowerIncomeSourceType` · `GET /v1/GrkiBorrowerIncomeSourceType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/GrkiBorrowerIncomeSourceType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanApplicationGrkiBorrowerIncome](#loanapplicationgrkiborrowerincome) | `GrkiBorrowerIncomeSourceType` | `/v1/GrkiBorrowerIncomeSourceType/{id}/LoanApplicationGrkiBorrowerIncome?by=GrkiBorrowerIncomeSourceType` |

## GrkiFactoringDirectionType

`dbo.GrkiFactoringDirectionType` · 2 qator · PK: OID · 8 ustun

`GET /v1/GrkiFactoringDirectionType` · `GET /v1/GrkiFactoringDirectionType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/GrkiFactoringDirectionType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Factoring](#factoring) | `DirectionType` | `/v1/GrkiFactoringDirectionType/{id}/Factoring?by=DirectionType` |

## GrkiFactoringDisclosureType

`dbo.GrkiFactoringDisclosureType` · 2 qator · PK: OID · 8 ustun

`GET /v1/GrkiFactoringDisclosureType` · `GET /v1/GrkiFactoringDisclosureType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/GrkiFactoringDisclosureType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Factoring](#factoring) | `DisclosureType` | `/v1/GrkiFactoringDisclosureType/{id}/Factoring?by=DisclosureType` |

## GrkiFactoringParticipationType

`dbo.GrkiFactoringParticipationType` · 2 qator · PK: OID · 8 ustun

`GET /v1/GrkiFactoringParticipationType` · `GET /v1/GrkiFactoringParticipationType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/GrkiFactoringParticipationType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Factoring](#factoring) | `ParticipationType` | `/v1/GrkiFactoringParticipationType/{id}/Factoring?by=ParticipationType` |

## GrkiFactoringRegressType

`dbo.GrkiFactoringRegressType` · 2 qator · PK: OID · 8 ustun

`GET /v1/GrkiFactoringRegressType` · `GET /v1/GrkiFactoringRegressType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/GrkiFactoringRegressType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Factoring](#factoring) | `RegressType` | `/v1/GrkiFactoringRegressType/{id}/Factoring?by=RegressType` |

## GrkiFactoringType

`dbo.GrkiFactoringType` · 2 qator · PK: OID · 8 ustun

`GET /v1/GrkiFactoringType` · `GET /v1/GrkiFactoringType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/GrkiFactoringType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Factoring](#factoring) | `Type` | `/v1/GrkiFactoringType/{id}/Factoring?by=Type` |

## GrkiLoanAuthorityType

`dbo.GrkiLoanAuthorityType` · 5 qator · PK: OID · 4 ustun

`GET /v1/GrkiLoanAuthorityType` · `GET /v1/GrkiLoanAuthorityType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/GrkiLoanAuthorityType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanApplication](#loanapplication) | `GrkiRejectedByAuthorityType` | `/v1/GrkiLoanAuthorityType/{id}/LoanApplication?by=GrkiRejectedByAuthorityType` |
| [Loan](#loan) | `GrkiApprovedByAuthorityType` | `/v1/GrkiLoanAuthorityType/{id}/Loan?by=GrkiApprovedByAuthorityType` |

## GroupClient

`dbo.GroupClient` · 0 qator · PK: OID · 5 ustun

`GET /v1/GroupClient` · `GET /v1/GroupClient/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [BaseClient](#baseclient) | OID |
| `Cashier` | [GroupClientItem](#groupclientitem) | OID |
| `Leader` | [GroupClientItem](#groupclientitem) | OID |

Misol: `/v1/GroupClient?expand=OID`

## GroupClientItem

`dbo.GroupClientItem` · 0 qator · PK: OID · 11 ustun

`GET /v1/GroupClientItem` · `GET /v1/GroupClientItem/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Client` | [BaseClient](#baseclient) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/GroupClientItem?expand=Client`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [GroupClient](#groupclient) | `Cashier` | `/v1/GroupClientItem/{id}/GroupClient?by=Cashier` |
| [GroupClient](#groupclient) | `Leader` | `/v1/GroupClientItem/{id}/GroupClient?by=Leader` |
| [FinObject](#finobject) | `Group` | `/v1/GroupClientItem/{id}/FinObject?by=Group` |

## IndividualClient

`dbo.IndividualClient` · 19 180 qator · PK: OID · 7 ustun

`GET /v1/IndividualClient` · `GET /v1/IndividualClient/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Person` | [Person](#person) | OID |
| `OID` | [BaseClient](#baseclient) | OID |
| `EmploymentType` | [IndividualClientEmploymentType](#individualclientemploymenttype) | OID |

Misol: `/v1/IndividualClient?expand=Person`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanCollateral](#loancollateral) | `RepresentationRepresentative` | `/v1/IndividualClient/{id}/LoanCollateral?by=RepresentationRepresentative` |
| [IndividualClientRegistrationDocument](#individualclientregistrationdocument) | `IndividualClient` | `/v1/IndividualClient/{id}/IndividualClientRegistrationDocument?by=IndividualClient` |

## IndividualClientEmploymentType

`dbo.IndividualClientEmploymentType` · 4 qator · PK: OID · 9 ustun

`GET /v1/IndividualClientEmploymentType` · `GET /v1/IndividualClientEmploymentType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/IndividualClientEmploymentType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [IndividualClient](#individualclient) | `EmploymentType` | `/v1/IndividualClientEmploymentType/{id}/IndividualClient?by=EmploymentType` |

## IndividualClientRegistrationDocument

`dbo.IndividualClientRegistrationDocument` · 1 qator · PK: OID · 18 ustun

`GET /v1/IndividualClientRegistrationDocument` · `GET /v1/IndividualClientRegistrationDocument/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `IndividualClient` | [IndividualClient](#individualclient) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/IndividualClientRegistrationDocument?expand=IndividualClient`

## InitialBalance

`dbo.InitialBalance` · 0 qator · PK: OID · 9 ustun

`GET /v1/InitialBalance` · `GET /v1/InitialBalance/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Account` | [OperationalAccount](#operationalaccount) | OID |
| `AccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/InitialBalance?expand=Account`

## InterestRateFormula

`dbo.InterestRateFormula` · 1 qator · PK: OID · 2 ustun

`GET /v1/InterestRateFormula` · `GET /v1/InterestRateFormula/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [OperationFormula](#operationformula) | OID |

Misol: `/v1/InterestRateFormula?expand=OID`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinObject](#finobject) | `InterestRateFormula` | `/v1/InterestRateFormula/{id}/FinObject?by=InterestRateFormula` |
| [FinProduct](#finproduct) | `InterestRateFormula` | `/v1/InterestRateFormula/{id}/FinProduct?by=InterestRateFormula` |

## LegalisationInfo

`dbo.LegalisationInfo` · 534 535 qator · PK: yo'q · 7 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/dbo.LegalisationInfo`.

## LegalisationInfoStaging

`dbo.LegalisationInfoStaging` · 76 qator · PK: yo'q · 8 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/dbo.LegalisationInfoStaging`.

## LegislativeClient

`dbo.LegislativeClient` · 33 qator · PK: OID · 19 ustun

`GET /v1/LegislativeClient` · `GET /v1/LegislativeClient/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [BaseClient](#baseclient) | OID |
| `SmallBusinessType` | [CollateralRegistryLegislativeClientSmallBusinessType](#collateralregistrylegislativeclientsmallbusinesstype) | OID |
| `LegalForm` | [LegislativeClientLegalForm](#legislativeclientlegalform) | OID |
| `ASOKIClientType` | [ASOKIClientType](#asokiclienttype) | OID |
| `RegistrationPlace` | [RegistrationPlace](#registrationplace) | OID |

Misol: `/v1/LegislativeClient?expand=OID`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [ThisCompany](#thiscompany) | `OID` | `/v1/LegislativeClient/{id}/ThisCompany?by=OID` |
| [Representative](#representative) | `LegislativeClient` | `/v1/LegislativeClient/{id}/Representative?by=LegislativeClient` |
| [LegislativeClientFoundersAgreement](#legislativeclientfoundersagreement) | `LegislativeClient` | `/v1/LegislativeClient/{id}/LegislativeClientFoundersAgreement?by=LegislativeClient` |

## LegislativeClientFounder

`dbo.LegislativeClientFounder` · 0 qator · PK: OID · 15 ustun

`GET /v1/LegislativeClientFounder` · `GET /v1/LegislativeClientFounder/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Client` | [BaseClient](#baseclient) | OID |
| `FoundersAgreement` | [LegislativeClientFoundersAgreement](#legislativeclientfoundersagreement) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/LegislativeClientFounder?expand=Client`

## LegislativeClientFoundersAgreement

`dbo.LegislativeClientFoundersAgreement` · 0 qator · PK: OID · 14 ustun

`GET /v1/LegislativeClientFoundersAgreement` · `GET /v1/LegislativeClientFoundersAgreement/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `LegislativeClient` | [LegislativeClient](#legislativeclient) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/LegislativeClientFoundersAgreement?expand=LegislativeClient`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LegislativeClientFounder](#legislativeclientfounder) | `FoundersAgreement` | `/v1/LegislativeClientFoundersAgreement/{id}/LegislativeClientFounder?by=FoundersAgreement` |

## LegislativeClientLegalForm

`dbo.LegislativeClientLegalForm` · 24 qator · PK: OID · 14 ustun

`GET /v1/LegislativeClientLegalForm` · `GET /v1/LegislativeClientLegalForm/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/LegislativeClientLegalForm?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LegislativeClient](#legislativeclient) | `LegalForm` | `/v1/LegislativeClientLegalForm/{id}/LegislativeClient?by=LegalForm` |

## Loan

`dbo.Loan` · 15 738 qator · PK: OID · 35 ustun

`GET /v1/Loan` · `GET /v1/Loan/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `ObjectOfLeasingTypeToDelete` | [ObjectOfLeasingType](#objectofleasingtype) | OID |
| `Application` | [LoanApplication](#loanapplication) | OID |
| `PurposeAdditional1` | [LoanPurposeAdditional1](#loanpurposeadditional1) | OID |
| `PurposeAdditional2` | [LoanPurposeAdditional2](#loanpurposeadditional2) | OID |
| `PurposeAdditional3` | [LoanPurposeAdditional3](#loanpurposeadditional3) | OID |
| `NationalEconomySector` | [NationalEconomySector](#nationaleconomysector) | OID |
| `OID` | [FinObject](#finobject) | OID |
| `BorrowerType` | [BorrowerType](#borrowertype) | OID |
| `LoanType` | [LoanType](#loantype) | OID |
| `Purpose` | [LoanPurpose](#loanpurpose) | OID |
| `GrkiApprovedByAuthorityType` | [GrkiLoanAuthorityType](#grkiloanauthoritytype) | OID |

Misol: `/v1/Loan?expand=ObjectOfLeasingTypeToDelete`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanCollateral](#loancollateral) | `Loan` | `/v1/Loan/{id}/LoanCollateral?by=Loan` |
| [LoanClassification](#loanclassification) | `Loan` | `/v1/Loan/{id}/LoanClassification?by=Loan` |

## LoanApplication

`dbo.LoanApplication` · 21 398 qator · PK: OID · 22 ustun

`GET /v1/LoanApplication` · `GET /v1/LoanApplication/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `DmsApproveReason` | [LoanApplicationDmsApproveReason](#loanapplicationdmsapprovereason) | OID |
| `DmsRejectReason` | [LoanApplicationDmsRejectReason](#loanapplicationdmsrejectreason) | OID |
| `RejectReason` | [LoanApplicationRejectReason](#loanapplicationrejectreason) | OID |
| `OID` | [FinObject](#finobject) | OID |
| `LoanProduct` | [LoanProduct](#loanproduct) | OID |
| `GrkiBorrowerActivityType` | [GrkiBorrowerActivityType](#grkiborroweractivitytype) | OID |
| `GrkiRejectedByAuthorityType` | [GrkiLoanAuthorityType](#grkiloanauthoritytype) | OID |

Misol: `/v1/LoanApplication?expand=DmsApproveReason`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Loan](#loan) | `Application` | `/v1/LoanApplication/{id}/Loan?by=Application` |
| [LoanApplicationParticipants](#loanapplicationparticipants) | `LoanApplication` | `/v1/LoanApplication/{id}/LoanApplicationParticipants?by=LoanApplication` |
| [Grki_LoanApplicationGrkiRegistartionNumber](#grki_loanapplicationgrkiregistartionnumber) | `LoanApplication` | `/v1/LoanApplication/{id}/Grki_LoanApplicationGrkiRegistartionNumber?by=LoanApplication` |
| [LoanApplicationGrkiBorrowerIncome](#loanapplicationgrkiborrowerincome) | `LoanApplication` | `/v1/LoanApplication/{id}/LoanApplicationGrkiBorrowerIncome?by=LoanApplication` |

## LoanApplicationDmsApproveReason

`dbo.LoanApplicationDmsApproveReason` · 0 qator · PK: OID · 11 ustun

`GET /v1/LoanApplicationDmsApproveReason` · `GET /v1/LoanApplicationDmsApproveReason/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/LoanApplicationDmsApproveReason?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanApplication](#loanapplication) | `DmsApproveReason` | `/v1/LoanApplicationDmsApproveReason/{id}/LoanApplication?by=DmsApproveReason` |

## LoanApplicationDmsRejectReason

`dbo.LoanApplicationDmsRejectReason` · 1 qator · PK: OID · 11 ustun

`GET /v1/LoanApplicationDmsRejectReason` · `GET /v1/LoanApplicationDmsRejectReason/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/LoanApplicationDmsRejectReason?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanApplication](#loanapplication) | `DmsRejectReason` | `/v1/LoanApplicationDmsRejectReason/{id}/LoanApplication?by=DmsRejectReason` |

## LoanApplicationGrkiBorrowerIncome

`dbo.LoanApplicationGrkiBorrowerIncome` · 0 qator · PK: OID · 5 ustun

`GET /v1/LoanApplicationGrkiBorrowerIncome` · `GET /v1/LoanApplicationGrkiBorrowerIncome/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `LoanApplication` | [LoanApplication](#loanapplication) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `GrkiBorrowerIncomeSourceType` | [GrkiBorrowerIncomeSourceType](#grkiborrowerincomesourcetype) | OID |

Misol: `/v1/LoanApplicationGrkiBorrowerIncome?expand=LoanApplication`

## LoanApplicationParticipants

`dbo.LoanApplicationParticipants` · 0 qator · PK: OID · 13 ustun

`GET /v1/LoanApplicationParticipants` · `GET /v1/LoanApplicationParticipants/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Client` | [BaseClient](#baseclient) | OID |
| `LoanApplication` | [LoanApplication](#loanapplication) | OID |
| `ASOKILoanApplicationParticipantType` | [ASOKILoanApplicationParticipantType_A18Reference](#asokiloanapplicationparticipanttype_a18reference) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/LoanApplicationParticipants?expand=Client`

## LoanApplicationProduct

`dbo.LoanApplicationProduct` · 1 qator · PK: OID · 2 ustun

`GET /v1/LoanApplicationProduct` · `GET /v1/LoanApplicationProduct/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [FinProduct](#finproduct) | OID |

Misol: `/v1/LoanApplicationProduct?expand=OID`

## LoanApplicationRejectReason

`dbo.LoanApplicationRejectReason` · 9 qator · PK: OID · 14 ustun

`GET /v1/LoanApplicationRejectReason` · `GET /v1/LoanApplicationRejectReason/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/LoanApplicationRejectReason?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanApplication](#loanapplication) | `RejectReason` | `/v1/LoanApplicationRejectReason/{id}/LoanApplication?by=RejectReason` |

## LoanClassification

`dbo.LoanClassification` · 20 117 qator · PK: OID · 13 ustun

`GET /v1/LoanClassification` · `GET /v1/LoanClassification/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `ClassificationType` | [LoanClassificationType](#loanclassificationtype) | OID |
| `Loan` | [Loan](#loan) | OID |

Misol: `/v1/LoanClassification?expand=GCRecord`

## LoanClassificationType

`dbo.LoanClassificationType` · 5 qator · PK: OID · 14 ustun

`GET /v1/LoanClassificationType` · `GET /v1/LoanClassificationType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/LoanClassificationType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanClassification](#loanclassification) | `ClassificationType` | `/v1/LoanClassificationType/{id}/LoanClassification?by=ClassificationType` |

## LoanCollateral

`dbo.LoanCollateral` · 18 613 qator · PK: OID · 55 ustun

`GET /v1/LoanCollateral` · `GET /v1/LoanCollateral/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `CollateralType` | [LoanCollateralType](#loancollateraltype) | OID |
| `GrkiLocationCountry` | [Country](#country) | OID |
| `IndividualGuarantorToDelete` | [Person](#person) | OID |
| `ObjectOfLeasingType` | [ObjectOfLeasingType](#objectofleasingtype) | OID |
| `GuarantorToDelete` | [BaseClient](#baseclient) | OID |
| `GuarantorOrOwner` | [BaseClient](#baseclient) | OID |
| `Currency` | [Currency](#currency) | OID |
| `GrkiLocationRegion` | [Region](#region) | OID |
| `RepresentationContractType` | [RepresentationContractType](#representationcontracttype) | OID |
| `GrkiLocationDistrict` | [District](#district) | OID |
| `RepresentationRepresentative` | [IndividualClient](#individualclient) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `ObjectType` | [XPObjectType](#xpobjecttype) | OID |
| `Loan` | [Loan](#loan) | OID |
| `GuarantorClientTypeClassifierToDelete` | [ClientTypeClassifier](#clienttypeclassifier) | OID |
| `GuarantorResidencyToDelete` | [ResidencyType](#residencytype) | OID |

Misol: `/v1/LoanCollateral?expand=CollateralType`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanCollateralRealEstate](#loancollateralrealestate) | `OID` | `/v1/LoanCollateral/{id}/LoanCollateralRealEstate?by=OID` |
| [LoanCollateralVehicle](#loancollateralvehicle) | `OID` | `/v1/LoanCollateral/{id}/LoanCollateralVehicle?by=OID` |
| [LoanCollateralEquipment](#loancollateralequipment) | `OID` | `/v1/LoanCollateral/{id}/LoanCollateralEquipment?by=OID` |
| [PropertyInsurancePolicy](#propertyinsurancepolicy) | `LoanCollateral` | `/v1/LoanCollateral/{id}/PropertyInsurancePolicy?by=LoanCollateral` |
| [PropertyAppraisalReport](#propertyappraisalreport) | `LoanCollateral` | `/v1/LoanCollateral/{id}/PropertyAppraisalReport?by=LoanCollateral` |
| [LoanCollateralGuarantee](#loancollateralguarantee) | `OID` | `/v1/LoanCollateral/{id}/LoanCollateralGuarantee?by=OID` |
| [LoanCollateralInsurancePolicy](#loancollateralinsurancepolicy) | `OID` | `/v1/LoanCollateral/{id}/LoanCollateralInsurancePolicy?by=OID` |
| [LoanCollateralDeposit](#loancollateraldeposit) | `OID` | `/v1/LoanCollateral/{id}/LoanCollateralDeposit?by=OID` |
| [LoanCollateralJewellery](#loancollateraljewellery) | `OID` | `/v1/LoanCollateral/{id}/LoanCollateralJewellery?by=OID` |
| [FlexFinApi_LoanCollateralsWithInsertedOffbalanceOperations](#flexfinapi_loancollateralswithinsertedoffbalanceoperations) | `LoanCollateralOid` | `/v1/LoanCollateral/{id}/FlexFinApi_LoanCollateralsWithInsertedOffbalanceOperations?by=LoanCollateralOid` |

## LoanCollateralDeposit

`dbo.LoanCollateralDeposit` · 0 qator · PK: OID · 7 ustun

`GET /v1/LoanCollateralDeposit` · `GET /v1/LoanCollateralDeposit/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [LoanCollateral](#loancollateral) | OID |
| `ASOKIDepositType` | [ASOKIDepositType](#asokideposittype) | OID |
| `DepositBankBranch` | [BankBranch](#bankbranch) | OID |

Misol: `/v1/LoanCollateralDeposit?expand=OID`

## LoanCollateralEquipment

`dbo.LoanCollateralEquipment` · 0 qator · PK: OID · 7 ustun

`GET /v1/LoanCollateralEquipment` · `GET /v1/LoanCollateralEquipment/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [LoanCollateral](#loancollateral) | OID |

Misol: `/v1/LoanCollateralEquipment?expand=OID`

## LoanCollateralGuarantee

`dbo.LoanCollateralGuarantee` · 20 qator · PK: OID · 8 ustun

`GET /v1/LoanCollateralGuarantee` · `GET /v1/LoanCollateralGuarantee/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [LoanCollateral](#loancollateral) | OID |
| `IndividualGuarantorToDelete` | [Person](#person) | OID |
| `GuarantorBankBranchToDelete` | [BankBranch](#bankbranch) | OID |
| `GuarantorDirectOrganToDelete` | [DirectOrgan](#directorgan) | OID |
| `GuarantorASOKIClientTypeToDelete` | [ASOKIClientType](#asokiclienttype) | OID |
| `GuarantorNationalEconomySectorToDelete` | [NationalEconomySector](#nationaleconomysector) | OID |

Misol: `/v1/LoanCollateralGuarantee?expand=OID`

## LoanCollateralInsurancePolicy

`dbo.LoanCollateralInsurancePolicy` · 3 338 qator · PK: OID · 7 ustun

`GET /v1/LoanCollateralInsurancePolicy` · `GET /v1/LoanCollateralInsurancePolicy/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [LoanCollateral](#loancollateral) | OID |

Misol: `/v1/LoanCollateralInsurancePolicy?expand=OID`

## LoanCollateralJewellery

`dbo.LoanCollateralJewellery` · 84 qator · PK: OID · 8 ustun

`GET /v1/LoanCollateralJewellery` · `GET /v1/LoanCollateralJewellery/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [LoanCollateral](#loancollateral) | OID |
| `PreciousMetalFineness` | [PreciousMetalFineness](#preciousmetalfineness) | OID |

Misol: `/v1/LoanCollateralJewellery?expand=OID`

## LoanCollateralRealEstate

`dbo.LoanCollateralRealEstate` · 2 466 qator · PK: OID · 16 ustun

`GET /v1/LoanCollateralRealEstate` · `GET /v1/LoanCollateralRealEstate/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [LoanCollateral](#loancollateral) | OID |
| `LocationCountry` | [Country](#country) | OID |
| `LocationRegion` | [Region](#region) | OID |
| `LocationDistrict` | [District](#district) | OID |

Misol: `/v1/LoanCollateralRealEstate?expand=OID`

## LoanCollateralType

`dbo.LoanCollateralType` · 36 qator · PK: OID · 21 ustun

`GET /v1/LoanCollateralType` · `GET /v1/LoanCollateralType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Parent` | [LoanCollateralType](#loancollateraltype) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/LoanCollateralType?expand=Parent`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanCollateralType](#loancollateraltype) | `Parent` | `/v1/LoanCollateralType/{id}/LoanCollateralType?by=Parent` |
| [LoanCollateral](#loancollateral) | `CollateralType` | `/v1/LoanCollateralType/{id}/LoanCollateral?by=CollateralType` |

## LoanCollateralVehicle

`dbo.LoanCollateralVehicle` · 12 705 qator · PK: OID · 13 ustun

`GET /v1/LoanCollateralVehicle` · `GET /v1/LoanCollateralVehicle/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [LoanCollateral](#loancollateral) | OID |
| `ProductionCountry` | [Country](#country) | OID |
| `VehicleType` | [VehicleType](#vehicletype) | OID |

Misol: `/v1/LoanCollateralVehicle?expand=OID`

## LoanProduct

`dbo.LoanProduct` · 15 qator · PK: OID · 12 ustun

`GET /v1/LoanProduct` · `GET /v1/LoanProduct/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [FinProduct](#finproduct) | OID |
| `BorrowerType` | [BorrowerType](#borrowertype) | OID |
| `LoanType` | [LoanType](#loantype) | OID |
| `Purpose` | [LoanPurpose](#loanpurpose) | OID |

Misol: `/v1/LoanProduct?expand=OID`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanApplication](#loanapplication) | `LoanProduct` | `/v1/LoanProduct/{id}/LoanApplication?by=LoanProduct` |

## LoanPurpose

`dbo.LoanPurpose` · 319 qator · PK: OID · 24 ustun

`GET /v1/LoanPurpose` · `GET /v1/LoanPurpose/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `Parent` | [LoanPurpose](#loanpurpose) | OID |

Misol: `/v1/LoanPurpose?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanPurpose](#loanpurpose) | `Parent` | `/v1/LoanPurpose/{id}/LoanPurpose?by=Parent` |
| [LoanProduct](#loanproduct) | `Purpose` | `/v1/LoanPurpose/{id}/LoanProduct?by=Purpose` |
| [Loan](#loan) | `Purpose` | `/v1/LoanPurpose/{id}/Loan?by=Purpose` |

## LoanPurpose112

`dbo.LoanPurpose112` · 32 qator · PK: OID · 12 ustun

`GET /v1/LoanPurpose112` · `GET /v1/LoanPurpose112/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/LoanPurpose112?expand=GCRecord`

## LoanPurposeAdditional1

`dbo.LoanPurposeAdditional1` · 0 qator · PK: OID · 9 ustun

`GET /v1/LoanPurposeAdditional1` · `GET /v1/LoanPurposeAdditional1/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/LoanPurposeAdditional1?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Loan](#loan) | `PurposeAdditional1` | `/v1/LoanPurposeAdditional1/{id}/Loan?by=PurposeAdditional1` |

## LoanPurposeAdditional2

`dbo.LoanPurposeAdditional2` · 0 qator · PK: OID · 9 ustun

`GET /v1/LoanPurposeAdditional2` · `GET /v1/LoanPurposeAdditional2/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/LoanPurposeAdditional2?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Loan](#loan) | `PurposeAdditional2` | `/v1/LoanPurposeAdditional2/{id}/Loan?by=PurposeAdditional2` |

## LoanPurposeAdditional3

`dbo.LoanPurposeAdditional3` · 0 qator · PK: OID · 9 ustun

`GET /v1/LoanPurposeAdditional3` · `GET /v1/LoanPurposeAdditional3/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/LoanPurposeAdditional3?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Loan](#loan) | `PurposeAdditional3` | `/v1/LoanPurposeAdditional3/{id}/Loan?by=PurposeAdditional3` |

## LoanType

`dbo.LoanType` · 30 qator · PK: OID · 27 ustun

`GET /v1/LoanType` · `GET /v1/LoanType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `Parent` | [LoanType](#loantype) | OID |

Misol: `/v1/LoanType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanProduct](#loanproduct) | `LoanType` | `/v1/LoanType/{id}/LoanProduct?by=LoanType` |
| [LoanType](#loantype) | `Parent` | `/v1/LoanType/{id}/LoanType?by=Parent` |
| [Loan](#loan) | `LoanType` | `/v1/LoanType/{id}/Loan?by=LoanType` |

## LoanUpdateLog

`dbo.LoanUpdateLog` · 166 030 qator · PK: yo'q · 11 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/dbo.LoanUpdateLog`.

## Location

`dbo.Location` · 38 434 qator · PK: OID · 14 ustun

`GET /v1/Location` · `GET /v1/Location/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Country` | [Country](#country) | OID |
| `Region` | [Region](#region) | OID |
| `District` | [District](#district) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `Mahalla` | [Mahalla](#mahalla) | OID |

Misol: `/v1/Location?expand=Country`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BaseClient](#baseclient) | `Address` | `/v1/Location/{id}/BaseClient?by=Address` |
| [BaseClient](#baseclient) | `AddressFactual` | `/v1/Location/{id}/BaseClient?by=AddressFactual` |

## LogDelete

`dbo.LogDelete` · 0 qator · PK: ID · 5 ustun

`GET /v1/LogDelete` · `GET /v1/LogDelete/{ID}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## LogUpdate

`dbo.LogUpdate` · 0 qator · PK: ID · 6 ustun

`GET /v1/LogUpdate` · `GET /v1/LogUpdate/{ID}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## Mahalla

`dbo.Mahalla` · 9 070 qator · PK: OID · 17 ustun

`GET /v1/Mahalla` · `GET /v1/Mahalla/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `District` | [District](#district) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/Mahalla?expand=District`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Location](#location) | `Mahalla` | `/v1/Mahalla/{id}/Location?by=Mahalla` |

## NationalEconomySector

`dbo.NationalEconomySector` · 758 qator · PK: OID · 15 ustun

`GET /v1/NationalEconomySector` · `GET /v1/NationalEconomySector/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/NationalEconomySector?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BaseClient](#baseclient) | `NationalEconomySector` | `/v1/NationalEconomySector/{id}/BaseClient?by=NationalEconomySector` |
| [Loan](#loan) | `NationalEconomySector` | `/v1/NationalEconomySector/{id}/Loan?by=NationalEconomySector` |
| [LoanCollateralGuarantee](#loancollateralguarantee) | `GuarantorNationalEconomySectorToDelete` | `/v1/NationalEconomySector/{id}/LoanCollateralGuarantee?by=GuarantorNationalEconomySectorToDelete` |

## NationalEconomySector2

`dbo.NationalEconomySector2` · 683 qator · PK: OID · 27 ustun

`GET /v1/NationalEconomySector2` · `GET /v1/NationalEconomySector2/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/NationalEconomySector2?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BaseClient](#baseclient) | `NationalEconomySector2` | `/v1/NationalEconomySector2/{id}/BaseClient?by=NationalEconomySector2` |

## NumerationFormulaSettings

`dbo.NumerationFormulaSettings` · 1 qator · PK: OID · 9 ustun

`GET /v1/NumerationFormulaSettings` · `GET /v1/NumerationFormulaSettings/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/NumerationFormulaSettings?expand=GCRecord`

## Numerator

`dbo.Numerator` · 9 qator · PK: OID · 11 ustun

`GET /v1/Numerator` · `GET /v1/Numerator/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/Numerator?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [NumeratorSettings](#numeratorsettings) | `Numerator` | `/v1/Numerator/{id}/NumeratorSettings?by=Numerator` |

## NumeratorSettings

`dbo.NumeratorSettings` · 12 qator · PK: OID · 15 ustun

`GET /v1/NumeratorSettings` · `GET /v1/NumeratorSettings/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Numerator` | [Numerator](#numerator) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/NumeratorSettings?expand=Numerator`

## NumeratorValue

`dbo.NumeratorValue` · 51 qator · PK: NumeratorSettings, KeyDate · 3 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## ObjectOfLeasingType

`dbo.ObjectOfLeasingType` · 7 qator · PK: OID · 18 ustun

`GET /v1/ObjectOfLeasingType` · `GET /v1/ObjectOfLeasingType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ObjectOfLeasingType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Loan](#loan) | `ObjectOfLeasingTypeToDelete` | `/v1/ObjectOfLeasingType/{id}/Loan?by=ObjectOfLeasingTypeToDelete` |
| [LoanCollateral](#loancollateral) | `ObjectOfLeasingType` | `/v1/ObjectOfLeasingType/{id}/LoanCollateral?by=ObjectOfLeasingType` |

## OperDayChangeLog

`dbo.OperDayChangeLog` · 2 741 qator · PK: yo'q · 5 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/dbo.OperDayChangeLog`.

## Operation

`dbo.Operation` · 11 181 676 qator · PK: OID · 20 ustun

`GET /v1/Operation` · `GET /v1/Operation/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `DebitAccount` | [OperationalAccount](#operationalaccount) | OID |
| `CreditAccount` | [OperationalAccount](#operationalaccount) | OID |
| `DebitAccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `CreditAccountQualifier` | [BaseAccountQualifier](#baseaccountqualifier) | OID |
| `Document` | [Document](#document) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `ObjectType` | [XPObjectType](#xpobjecttype) | OID |
| `Template` | [FinObjectOperationTemplate](#finobjectoperationtemplate) | OID |

Misol: `/v1/Operation?expand=DebitAccount`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [OperationClassification](#operationclassification) | `Operation` | `/v1/Operation/{id}/OperationClassification?by=Operation` |

## OperationAmountFormula

`dbo.OperationAmountFormula` · 44 qator · PK: OID · 2 ustun

`GET /v1/OperationAmountFormula` · `GET /v1/OperationAmountFormula/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinObjectTypeOperationTemplate](#finobjecttypeoperationtemplate) | `AmountFormula` | `/v1/OperationAmountFormula/{id}/FinObjectTypeOperationTemplate?by=AmountFormula` |
| [FinProductOperationTemplate](#finproductoperationtemplate) | `AmountFormula` | `/v1/OperationAmountFormula/{id}/FinProductOperationTemplate?by=AmountFormula` |

## OperationClassification

`dbo.OperationClassification` · 0 qator · PK: OID · 5 ustun

`GET /v1/OperationClassification` · `GET /v1/OperationClassification/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OperationClassificationRule` | [OperationClassificationRule](#operationclassificationrule) | OID |
| `FinObject` | [FinObject](#finobject) | OID |
| `Operation` | [Operation](#operation) | OID |

Misol: `/v1/OperationClassification?expand=OperationClassificationRule`

## OperationClassificationRule

`dbo.OperationClassificationRule` · 11 qator · PK: OID · 14 ustun

`GET /v1/OperationClassificationRule` · `GET /v1/OperationClassificationRule/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `FinObjectType` | [FinObjectType](#finobjecttype) | OID |
| `CreditLogicalAccountGroup` | [FinObjectTypeLogicalAccountGroup](#finobjecttypelogicalaccountgroup) | OID |
| `DebitLogicalAccountGroup` | [FinObjectTypeLogicalAccountGroup](#finobjecttypelogicalaccountgroup) | OID |
| `FinObjectTypeDocumentTemplate` | [FinObjectTypeDocumentTemplate](#finobjecttypedocumenttemplate) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/OperationClassificationRule?expand=FinObjectType`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [OperationClassification](#operationclassification) | `OperationClassificationRule` | `/v1/OperationClassificationRule/{id}/OperationClassification?by=OperationClassificationRule` |

## OperationDescriptionFormula

`dbo.OperationDescriptionFormula` · 4 qator · PK: OID · 2 ustun

`GET /v1/OperationDescriptionFormula` · `GET /v1/OperationDescriptionFormula/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [OperationFormula](#operationformula) | OID |

Misol: `/v1/OperationDescriptionFormula?expand=OID`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinObjectTypeOperationTemplate](#finobjecttypeoperationtemplate) | `DescriptionFormula` | `/v1/OperationDescriptionFormula/{id}/FinObjectTypeOperationTemplate?by=DescriptionFormula` |

## OperationFormula

`dbo.OperationFormula` · 126 qator · PK: OID · 13 ustun

`GET /v1/OperationFormula` · `GET /v1/OperationFormula/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `ObjectType` | [XPObjectType](#xpobjecttype) | OID |

Misol: `/v1/OperationFormula?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [OperationNumerationFormula](#operationnumerationformula) | `OID` | `/v1/OperationFormula/{id}/OperationNumerationFormula?by=OID` |
| [DocumentNumerationFormula](#documentnumerationformula) | `OID` | `/v1/OperationFormula/{id}/DocumentNumerationFormula?by=OID` |
| [CalculationMethodProviderFormula](#calculationmethodproviderformula) | `OID` | `/v1/OperationFormula/{id}/CalculationMethodProviderFormula?by=OID` |
| [FinObject](#finobject) | `CalculationMethodProviderFormula` | `/v1/OperationFormula/{id}/FinObject?by=CalculationMethodProviderFormula` |
| [AccountCodeFormula](#accountcodeformula) | `OID` | `/v1/OperationFormula/{id}/AccountCodeFormula?by=OID` |
| [PrintingObjectFormula](#printingobjectformula) | `OID` | `/v1/OperationFormula/{id}/PrintingObjectFormula?by=OID` |
| [OperationDescriptionFormula](#operationdescriptionformula) | `OID` | `/v1/OperationFormula/{id}/OperationDescriptionFormula?by=OID` |
| [InterestRateFormula](#interestrateformula) | `OID` | `/v1/OperationFormula/{id}/InterestRateFormula?by=OID` |
| [OperationFormulaCompatibleFormulas_FinObjectTypeDocumentTemplateCompatibleDocumentTemplates](#operationformulacompatibleformulas_finobjecttypedocumenttemplatecompatibledocumenttemplates) | `CompatibleFormulas` | `/v1/OperationFormula/{id}/OperationFormulaCompatibleFormulas_FinObjectTypeDocumentTemplateCompatibleDocumentTemplates?by=CompatibleFormulas` |
| [OperationFormulaCompatibleFormulas_FinObjectTypeOperationTemplateCompatibleOperationTemplates](#operationformulacompatibleformulas_finobjecttypeoperationtemplatecompatibleoperationtemplates) | `CompatibleFormulas` | `/v1/OperationFormula/{id}/OperationFormulaCompatibleFormulas_FinObjectTypeOperationTemplateCompatibleOperationTemplates?by=CompatibleFormulas` |
| [TemplateAvailabilityFormula](#templateavailabilityformula) | `OID` | `/v1/OperationFormula/{id}/TemplateAvailabilityFormula?by=OID` |
| [DocumentDateFormula](#documentdateformula) | `OID` | `/v1/OperationFormula/{id}/DocumentDateFormula?by=OID` |
| [DocumentAmountFormula](#documentamountformula) | `OID` | `/v1/OperationFormula/{id}/DocumentAmountFormula?by=OID` |

## OperationFormulaCompatibleFormulas_FinObjectTypeDocumentTemplateCompatibleDocumentTemplates

`dbo.OperationFormulaCompatibleFormulas_FinObjectTypeDocumentTemplateCompatibleDocumentTemplates` · 0 qator · PK: OID · 5 ustun

`GET /v1/OperationFormulaCompatibleFormulas_FinObjectTypeDocumentTemplateCompatibleDocumentTemplates` · `GET /v1/OperationFormulaCompatibleFormulas_FinObjectTypeDocumentTemplateCompatibleDocumentTemplates/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `CompatibleDocumentTemplates` | [FinObjectTypeDocumentTemplate](#finobjecttypedocumenttemplate) | OID |
| `CompatibleFormulas` | [OperationFormula](#operationformula) | OID |

Misol: `/v1/OperationFormulaCompatibleFormulas_FinObjectTypeDocumentTemplateCompatibleDocumentTemplates?expand=CompatibleDocumentTemplates`

## OperationFormulaCompatibleFormulas_FinObjectTypeOperationTemplateCompatibleOperationTemplates

`dbo.OperationFormulaCompatibleFormulas_FinObjectTypeOperationTemplateCompatibleOperationTemplates` · 0 qator · PK: OID · 5 ustun

`GET /v1/OperationFormulaCompatibleFormulas_FinObjectTypeOperationTemplateCompatibleOperationTemplates` · `GET /v1/OperationFormulaCompatibleFormulas_FinObjectTypeOperationTemplateCompatibleOperationTemplates/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `CompatibleOperationTemplates` | [FinObjectTypeOperationTemplate](#finobjecttypeoperationtemplate) | OID |
| `CompatibleFormulas` | [OperationFormula](#operationformula) | OID |

Misol: `/v1/OperationFormulaCompatibleFormulas_FinObjectTypeOperationTemplateCompatibleOperationTemplates?expand=CompatibleOperationTemplates`

## OperationNumerationFormula

`dbo.OperationNumerationFormula` · 1 qator · PK: OID · 2 ustun

`GET /v1/OperationNumerationFormula` · `GET /v1/OperationNumerationFormula/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [OperationFormula](#operationformula) | OID |

Misol: `/v1/OperationNumerationFormula?expand=OID`

## OperationPrintingFormula

`dbo.OperationPrintingFormula` · 2 qator · PK: yo'q · 2 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/dbo.OperationPrintingFormula`.

## OperationPrintingItem

`dbo.OperationPrintingItem` · 3 qator · PK: OID · 10 ustun

`GET /v1/OperationPrintingItem` · `GET /v1/OperationPrintingItem/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## OperationPrintingItemCard

`dbo.OperationPrintingItemCard` · 429 qator · PK: OID · 10 ustun

`GET /v1/OperationPrintingItemCard` · `GET /v1/OperationPrintingItemCard/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## OperationalAccount

`dbo.OperationalAccount` · 507 446 qator · PK: OID · 11 ustun

`GET /v1/OperationalAccount` · `GET /v1/OperationalAccount/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Client` | [BaseClient](#baseclient) | OID |
| `Currency` | [Currency](#currency) | OID |
| `OID` | [BaseAccount](#baseaccount) | OID |
| `FinObjectAccount` | [FinObjectAccount](#finobjectaccount) | OID |

Misol: `/v1/OperationalAccount?expand=Client`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinObjectOperationTemplate](#finobjectoperationtemplate) | `DebitAccount` | `/v1/OperationalAccount/{id}/FinObjectOperationTemplate?by=DebitAccount` |
| [FinObjectOperationTemplate](#finobjectoperationtemplate) | `CreditAccount` | `/v1/OperationalAccount/{id}/FinObjectOperationTemplate?by=CreditAccount` |
| [FinObjectDocumentTemplate](#finobjectdocumenttemplate) | `DebitAccount` | `/v1/OperationalAccount/{id}/FinObjectDocumentTemplate?by=DebitAccount` |
| [FinObjectDocumentTemplate](#finobjectdocumenttemplate) | `CreditAccount` | `/v1/OperationalAccount/{id}/FinObjectDocumentTemplate?by=CreditAccount` |
| [InitialBalance](#initialbalance) | `Account` | `/v1/OperationalAccount/{id}/InitialBalance?by=Account` |
| [Document](#document) | `DebitAccount` | `/v1/OperationalAccount/{id}/Document?by=DebitAccount` |
| [Document](#document) | `CreditAccount` | `/v1/OperationalAccount/{id}/Document?by=CreditAccount` |
| [Operation](#operation) | `DebitAccount` | `/v1/OperationalAccount/{id}/Operation?by=DebitAccount` |
| [Operation](#operation) | `CreditAccount` | `/v1/OperationalAccount/{id}/Operation?by=CreditAccount` |
| [FinObjectAccount](#finobjectaccount) | `Account` | `/v1/OperationalAccount/{id}/FinObjectAccount?by=Account` |

## Passport

`dbo.Passport` · 19 188 qator · PK: OID · 16 ustun

`GET /v1/Passport` · `GET /v1/Passport/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `RegistrationCountry` | [Country](#country) | OID |
| `RegistrationRegion` | [Region](#region) | OID |
| `PassportType` | [PassportType](#passporttype) | OID |
| `RegistrationDistrict` | [District](#district) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/Passport?expand=RegistrationCountry`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Person](#person) | `Passport` | `/v1/Passport/{id}/Person?by=Passport` |

## PassportType

`dbo.PassportType` · 10 qator · PK: OID · 15 ustun

`GET /v1/PassportType` · `GET /v1/PassportType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/PassportType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Passport](#passport) | `PassportType` | `/v1/PassportType/{id}/Passport?by=PassportType` |

## PaymentDocumentType

`dbo.PaymentDocumentType` · 0 qator · PK: OID · 8 ustun

`GET /v1/PaymentDocumentType` · `GET /v1/PaymentDocumentType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/PaymentDocumentType?expand=GCRecord`

## PaymentType

`dbo.PaymentType` · 4 qator · PK: OID · 16 ustun

`GET /v1/PaymentType` · `GET /v1/PaymentType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/PaymentType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinObject](#finobject) | `PaymentType` | `/v1/PaymentType/{id}/FinObject?by=PaymentType` |
| [FinProductPolicy](#finproductpolicy) | `PaymentType` | `/v1/PaymentType/{id}/FinProductPolicy?by=PaymentType` |
| [FinProduct](#finproduct) | `PaymentType` | `/v1/PaymentType/{id}/FinProduct?by=PaymentType` |

## PersistentImage

`dbo.PersistentImage` · 0 qator · PK: OID · 8 ustun

`GET /v1/PersistentImage` · `GET /v1/PersistentImage/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/PersistentImage?expand=GCRecord`

## Person

`dbo.Person` · 19 185 qator · PK: OID · 20 ustun

`GET /v1/Person` · `GET /v1/Person/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Passport` | [Passport](#passport) | OID |
| `Education` | [EducationType](#educationtype) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/Person?expand=Passport`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanCollateral](#loancollateral) | `IndividualGuarantorToDelete` | `/v1/Person/{id}/LoanCollateral?by=IndividualGuarantorToDelete` |
| [Representative](#representative) | `Person` | `/v1/Person/{id}/Representative?by=Person` |
| [IndividualClient](#individualclient) | `Person` | `/v1/Person/{id}/IndividualClient?by=Person` |
| [LoanCollateralGuarantee](#loancollateralguarantee) | `IndividualGuarantorToDelete` | `/v1/Person/{id}/LoanCollateralGuarantee?by=IndividualGuarantorToDelete` |

## PreciousMetalFineness

`dbo.PreciousMetalFineness` · 16 qator · PK: OID · 12 ustun

`GET /v1/PreciousMetalFineness` · `GET /v1/PreciousMetalFineness/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `PreciousMetalType` | [PreciousMetalType](#preciousmetaltype) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/PreciousMetalFineness?expand=PreciousMetalType`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [PreciousMetalRate](#preciousmetalrate) | `PreciousMetalFineness` | `/v1/PreciousMetalFineness/{id}/PreciousMetalRate?by=PreciousMetalFineness` |
| [LoanCollateralJewellery](#loancollateraljewellery) | `PreciousMetalFineness` | `/v1/PreciousMetalFineness/{id}/LoanCollateralJewellery?by=PreciousMetalFineness` |

## PreciousMetalRate

`dbo.PreciousMetalRate` · 16 qator · PK: OID · 13 ustun

`GET /v1/PreciousMetalRate` · `GET /v1/PreciousMetalRate/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `PreciousMetalFineness` | [PreciousMetalFineness](#preciousmetalfineness) | OID |

Misol: `/v1/PreciousMetalRate?expand=GCRecord`

## PreciousMetalType

`dbo.PreciousMetalType` · 2 qator · PK: OID · 11 ustun

`GET /v1/PreciousMetalType` · `GET /v1/PreciousMetalType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/PreciousMetalType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [PreciousMetalFineness](#preciousmetalfineness) | `PreciousMetalType` | `/v1/PreciousMetalType/{id}/PreciousMetalFineness?by=PreciousMetalType` |

## PrintingObjectFormula

`dbo.PrintingObjectFormula` · 1 qator · PK: OID · 2 ustun

`GET /v1/PrintingObjectFormula` · `GET /v1/PrintingObjectFormula/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [OperationFormula](#operationformula) | OID |

Misol: `/v1/PrintingObjectFormula?expand=OID`

## PropertyAppraisalReport

`dbo.PropertyAppraisalReport` · 13 qator · PK: OID · 18 ustun

`GET /v1/PropertyAppraisalReport` · `GET /v1/PropertyAppraisalReport/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `LoanCollateral` | [LoanCollateral](#loancollateral) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/PropertyAppraisalReport?expand=LoanCollateral`

## PropertyInsurancePolicy

`dbo.PropertyInsurancePolicy` · 0 qator · PK: OID · 20 ustun

`GET /v1/PropertyInsurancePolicy` · `GET /v1/PropertyInsurancePolicy/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `LoanCollateral` | [LoanCollateral](#loancollateral) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/PropertyInsurancePolicy?expand=LoanCollateral`

## PropertyType

`dbo.PropertyType` · 54 qator · PK: OID · 13 ustun

`GET /v1/PropertyType` · `GET /v1/PropertyType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/PropertyType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BaseClient](#baseclient) | `PropertyType` | `/v1/PropertyType/{id}/BaseClient?by=PropertyType` |

## Region

`dbo.Region` · 14 qator · PK: OID · 16 ustun

`GET /v1/Region` · `GET /v1/Region/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Country` | [Country](#country) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/Region?expand=Country`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanCollateral](#loancollateral) | `GrkiLocationRegion` | `/v1/Region/{id}/LoanCollateral?by=GrkiLocationRegion` |
| [LoanCollateralRealEstate](#loancollateralrealestate) | `LocationRegion` | `/v1/Region/{id}/LoanCollateralRealEstate?by=LocationRegion` |
| [Location](#location) | `Region` | `/v1/Region/{id}/Location?by=Region` |
| [BankBranch](#bankbranch) | `Region` | `/v1/Region/{id}/BankBranch?by=Region` |
| [District](#district) | `Region` | `/v1/Region/{id}/District?by=Region` |
| [Passport](#passport) | `RegistrationRegion` | `/v1/Region/{id}/Passport?by=RegistrationRegion` |

## RegistrationPlace

`dbo.RegistrationPlace` · 54 qator · PK: OID · 9 ustun

`GET /v1/RegistrationPlace` · `GET /v1/RegistrationPlace/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/RegistrationPlace?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LegislativeClient](#legislativeclient) | `RegistrationPlace` | `/v1/RegistrationPlace/{id}/LegislativeClient?by=RegistrationPlace` |

## RepresentationContractType

`dbo.RepresentationContractType` · 3 qator · PK: OID · 11 ustun

`GET /v1/RepresentationContractType` · `GET /v1/RepresentationContractType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/RepresentationContractType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanCollateral](#loancollateral) | `RepresentationContractType` | `/v1/RepresentationContractType/{id}/LoanCollateral?by=RepresentationContractType` |

## RepresentationType

`dbo.RepresentationType` · 4 qator · PK: OID · 9 ustun

`GET /v1/RepresentationType` · `GET /v1/RepresentationType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/RepresentationType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Representative](#representative) | `RepresentationType` | `/v1/RepresentationType/{id}/Representative?by=RepresentationType` |

## Representative

`dbo.Representative` · 4 qator · PK: OID · 12 ustun

`GET /v1/Representative` · `GET /v1/Representative/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `LegislativeClient` | [LegislativeClient](#legislativeclient) | OID |
| `Person` | [Person](#person) | OID |
| `RepresentationType` | [RepresentationType](#representationtype) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/Representative?expand=LegislativeClient`

## ResidencyType

`dbo.ResidencyType` · 2 qator · PK: OID · 14 ustun

`GET /v1/ResidencyType` · `GET /v1/ResidencyType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ResidencyType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanCollateral](#loancollateral) | `GuarantorResidencyToDelete` | `/v1/ResidencyType/{id}/LoanCollateral?by=GuarantorResidencyToDelete` |
| [BaseClient](#baseclient) | `Residency` | `/v1/ResidencyType/{id}/BaseClient?by=Residency` |

## ScheduleConfiguration

`dbo.ScheduleConfiguration` · 3 qator · PK: OID · 12 ustun

`GET /v1/ScheduleConfiguration` · `GET /v1/ScheduleConfiguration/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `FinObjectType` | [FinObjectType](#finobjecttype) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/ScheduleConfiguration?expand=FinObjectType`

## Share

`dbo.Share` · 4 qator · PK: OID · 2 ustun

`GET /v1/Share` · `GET /v1/Share/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [FinObject](#finobject) | OID |

Misol: `/v1/Share?expand=OID`

## ShareProduct

`dbo.ShareProduct` · 1 qator · PK: OID · 2 ustun

`GET /v1/ShareProduct` · `GET /v1/ShareProduct/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [FinProduct](#finproduct) | OID |

Misol: `/v1/ShareProduct?expand=OID`

## SimpleOperationTemplate

`dbo.SimpleOperationTemplate` · 0 qator · PK: OID · 14 ustun

`GET /v1/SimpleOperationTemplate` · `GET /v1/SimpleOperationTemplate/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/SimpleOperationTemplate?expand=GCRecord`

## TMP_RequestedPinfl

`dbo.TMP_RequestedPinfl` · 287 qator · PK: yo'q · 4 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/dbo.TMP_RequestedPinfl`.

## Tag

`dbo.Tag` · 7 706 qator · PK: OID · 16 ustun

`GET /v1/Tag` · `GET /v1/Tag/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `tagType` | [TagType](#tagtype) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/Tag?expand=tagType`

## TagType

`dbo.TagType` · 11 qator · PK: OID · 13 ustun

`GET /v1/TagType` · `GET /v1/TagType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/TagType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [Tag](#tag) | `tagType` | `/v1/TagType/{id}/Tag?by=tagType` |

## TaxOrganisation

`dbo.TaxOrganisation` · 236 qator · PK: OID · 9 ustun

`GET /v1/TaxOrganisation` · `GET /v1/TaxOrganisation/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/TaxOrganisation?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BaseClient](#baseclient) | `TaxOrganisation` | `/v1/TaxOrganisation/{id}/BaseClient?by=TaxOrganisation` |

## TelephoneNumber

`dbo.TelephoneNumber` · 43 724 qator · PK: OID · 11 ustun

`GET /v1/TelephoneNumber` · `GET /v1/TelephoneNumber/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `ContactInformation` | [ContactInformation](#contactinformation) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/TelephoneNumber?expand=ContactInformation`

## TemplateAvailabilityFormula

`dbo.TemplateAvailabilityFormula` · 34 qator · PK: OID · 2 ustun

`GET /v1/TemplateAvailabilityFormula` · `GET /v1/TemplateAvailabilityFormula/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [OperationFormula](#operationformula) | OID |

Misol: `/v1/TemplateAvailabilityFormula?expand=OID`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [FinObjectDocumentTemplate](#finobjectdocumenttemplate) | `AvailabilityFormula` | `/v1/TemplateAvailabilityFormula/{id}/FinObjectDocumentTemplate?by=AvailabilityFormula` |
| [FinObjectTypeDocumentTemplate](#finobjecttypedocumenttemplate) | `AvailabilityFormula` | `/v1/TemplateAvailabilityFormula/{id}/FinObjectTypeDocumentTemplate?by=AvailabilityFormula` |
| [FinProductDocumentTemplate](#finproductdocumenttemplate) | `AvailabilityFormula` | `/v1/TemplateAvailabilityFormula/{id}/FinProductDocumentTemplate?by=AvailabilityFormula` |

## ThisCompany

`dbo.ThisCompany` · 1 qator · PK: OID · 2 ustun

`GET /v1/ThisCompany` · `GET /v1/ThisCompany/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `OID` | [LegislativeClient](#legislativeclient) | OID |

Misol: `/v1/ThisCompany?expand=OID`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [ApplicationData](#applicationdata) | `ThisCompany` | `/v1/ThisCompany/{id}/ApplicationData?by=ThisCompany` |

## TurnoverAndBalanceCacheWithQualifier

`dbo.TurnoverAndBalanceCacheWithQualifier` · 10 686 223 qator · PK: Date, Account, AccountQualifier, Type · 8 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## UserSettings

`dbo.UserSettings` · 158 qator · PK: OID · 10 ustun

`GET /v1/UserSettings` · `GET /v1/UserSettings/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/UserSettings?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [isUser](#isuser) | `Settings` | `/v1/UserSettings/{id}/isUser?by=Settings` |

## VehicleType

`dbo.VehicleType` · 6 qator · PK: OID · 14 ustun

`GET /v1/VehicleType` · `GET /v1/VehicleType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/VehicleType?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [LoanCollateralVehicle](#loancollateralvehicle) | `VehicleType` | `/v1/VehicleType/{id}/LoanCollateralVehicle?by=VehicleType` |

## XPDeletedObject

`dbo.XPDeletedObject` · 4 444 qator · PK: OID · 3 ustun

`GET /v1/XPDeletedObject` · `GET /v1/XPDeletedObject/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `TargetType` | [XPObjectType](#xpobjecttype) | OID |

Misol: `/v1/XPDeletedObject?expand=TargetType`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [AffiliationType](#affiliationtype) | `GCRecord` | `/v1/XPDeletedObject/{id}/AffiliationType?by=GCRecord` |
| [GrkiLoanAuthorityType](#grkiloanauthoritytype) | `GCRecord` | `/v1/XPDeletedObject/{id}/GrkiLoanAuthorityType?by=GCRecord` |
| [GlobalVariable](#globalvariable) | `GCRecord` | `/v1/XPDeletedObject/{id}/GlobalVariable?by=GCRecord` |
| [FinObjectType](#finobjecttype) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinObjectType?by=GCRecord` |
| [TaxOrganisation](#taxorganisation) | `GCRecord` | `/v1/XPDeletedObject/{id}/TaxOrganisation?by=GCRecord` |
| [Location](#location) | `GCRecord` | `/v1/XPDeletedObject/{id}/Location?by=GCRecord` |
| [GrkiBorrowerIncomeSourceType](#grkiborrowerincomesourcetype) | `GCRecord` | `/v1/XPDeletedObject/{id}/GrkiBorrowerIncomeSourceType?by=GCRecord` |
| [PaymentType](#paymenttype) | `GCRecord` | `/v1/XPDeletedObject/{id}/PaymentType?by=GCRecord` |
| [FinObjectOperationTemplate](#finobjectoperationtemplate) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinObjectOperationTemplate?by=GCRecord` |
| [FinObjectTypeLogicalAccountGroupItem](#finobjecttypelogicalaccountgroupitem) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinObjectTypeLogicalAccountGroupItem?by=GCRecord` |
| [LoanApplicationGrkiBorrowerIncome](#loanapplicationgrkiborrowerincome) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanApplicationGrkiBorrowerIncome?by=GCRecord` |
| [ResidencyType](#residencytype) | `GCRecord` | `/v1/XPDeletedObject/{id}/ResidencyType?by=GCRecord` |
| [Operation](#operation) | `GCRecord` | `/v1/XPDeletedObject/{id}/Operation?by=GCRecord` |
| [DepositType](#deposittype) | `GCRecord` | `/v1/XPDeletedObject/{id}/DepositType?by=GCRecord` |
| [FinObjectAccount](#finobjectaccount) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinObjectAccount?by=GCRecord` |
| [GrkiBorrowerActivityType](#grkiborroweractivitytype) | `GCRecord` | `/v1/XPDeletedObject/{id}/GrkiBorrowerActivityType?by=GCRecord` |
| [RegistrationPlace](#registrationplace) | `GCRecord` | `/v1/XPDeletedObject/{id}/RegistrationPlace?by=GCRecord` |
| [LoanPurpose](#loanpurpose) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanPurpose?by=GCRecord` |
| [isUserGroup](#isusergroup) | `GCRecord` | `/v1/XPDeletedObject/{id}/isUserGroup?by=GCRecord` |
| [LoanClassification](#loanclassification) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanClassification?by=GCRecord` |
| [BaseAccount](#baseaccount) | `GCRecord` | `/v1/XPDeletedObject/{id}/BaseAccount?by=GCRecord` |
| [BorrowerType](#borrowertype) | `GCRecord` | `/v1/XPDeletedObject/{id}/BorrowerType?by=GCRecord` |
| [FinObjectDocumentTemplate](#finobjectdocumenttemplate) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinObjectDocumentTemplate?by=GCRecord` |
| [LoanType](#loantype) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanType?by=GCRecord` |
| [AccountLogicalGroup](#accountlogicalgroup) | `GCRecord` | `/v1/XPDeletedObject/{id}/AccountLogicalGroup?by=GCRecord` |
| [TelephoneNumber](#telephonenumber) | `GCRecord` | `/v1/XPDeletedObject/{id}/TelephoneNumber?by=GCRecord` |
| [isUser](#isuser) | `GCRecord` | `/v1/XPDeletedObject/{id}/isUser?by=GCRecord` |
| [AccountQualifierType](#accountqualifiertype) | `GCRecord` | `/v1/XPDeletedObject/{id}/AccountQualifierType?by=GCRecord` |
| [LoanClassificationType](#loanclassificationtype) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanClassificationType?by=GCRecord` |
| [isGUIPermission](#isguipermission) | `GCRecord` | `/v1/XPDeletedObject/{id}/isGUIPermission?by=GCRecord` |
| [PreciousMetalFineness](#preciousmetalfineness) | `GCRecord` | `/v1/XPDeletedObject/{id}/PreciousMetalFineness?by=GCRecord` |
| [FaxNumber](#faxnumber) | `GCRecord` | `/v1/XPDeletedObject/{id}/FaxNumber?by=GCRecord` |
| [PreciousMetalRate](#preciousmetalrate) | `GCRecord` | `/v1/XPDeletedObject/{id}/PreciousMetalRate?by=GCRecord` |
| [Mahalla](#mahalla) | `GCRecord` | `/v1/XPDeletedObject/{id}/Mahalla?by=GCRecord` |
| [LoanPurpose112](#loanpurpose112) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanPurpose112?by=GCRecord` |
| [FinObject](#finobject) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinObject?by=GCRecord` |
| [Employee](#employee) | `GCRecord` | `/v1/XPDeletedObject/{id}/Employee?by=GCRecord` |
| [Representative](#representative) | `GCRecord` | `/v1/XPDeletedObject/{id}/Representative?by=GCRecord` |
| [OperationClassificationRule](#operationclassificationrule) | `GCRecord` | `/v1/XPDeletedObject/{id}/OperationClassificationRule?by=GCRecord` |
| [PreciousMetalType](#preciousmetaltype) | `GCRecord` | `/v1/XPDeletedObject/{id}/PreciousMetalType?by=GCRecord` |
| [EMail](#email) | `GCRecord` | `/v1/XPDeletedObject/{id}/EMail?by=GCRecord` |
| [NumeratorSettings](#numeratorsettings) | `GCRecord` | `/v1/XPDeletedObject/{id}/NumeratorSettings?by=GCRecord` |
| [FinProductDocumentTemplate](#finproductdocumenttemplate) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinProductDocumentTemplate?by=GCRecord` |
| [ApplicationData](#applicationdata) | `GCRecord` | `/v1/XPDeletedObject/{id}/ApplicationData?by=GCRecord` |
| [ClientImageAttachment](#clientimageattachment) | `GCRecord` | `/v1/XPDeletedObject/{id}/ClientImageAttachment?by=GCRecord` |
| [OperationFormula](#operationformula) | `GCRecord` | `/v1/XPDeletedObject/{id}/OperationFormula?by=GCRecord` |
| [FinObjectAttachment](#finobjectattachment) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinObjectAttachment?by=GCRecord` |
| [RepresentationType](#representationtype) | `GCRecord` | `/v1/XPDeletedObject/{id}/RepresentationType?by=GCRecord` |
| [EducationType](#educationtype) | `GCRecord` | `/v1/XPDeletedObject/{id}/EducationType?by=GCRecord` |
| [FinProductExtendedProperty](#finproductextendedproperty) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinProductExtendedProperty?by=GCRecord` |
| [LegislativeClientFoundersAgreement](#legislativeclientfoundersagreement) | `GCRecord` | `/v1/XPDeletedObject/{id}/LegislativeClientFoundersAgreement?by=GCRecord` |
| [FinProductOperationTemplate](#finproductoperationtemplate) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinProductOperationTemplate?by=GCRecord` |
| [IndividualClientEmploymentType](#individualclientemploymenttype) | `GCRecord` | `/v1/XPDeletedObject/{id}/IndividualClientEmploymentType?by=GCRecord` |
| [LegislativeClientFounder](#legislativeclientfounder) | `GCRecord` | `/v1/XPDeletedObject/{id}/LegislativeClientFounder?by=GCRecord` |
| [FinObjectTypeLogicalAccountGroup](#finobjecttypelogicalaccountgroup) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinObjectTypeLogicalAccountGroup?by=GCRecord` |
| [PropertyType](#propertytype) | `GCRecord` | `/v1/XPDeletedObject/{id}/PropertyType?by=GCRecord` |
| [FinObjectTypeExtendedProperty](#finobjecttypeextendedproperty) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinObjectTypeExtendedProperty?by=GCRecord` |
| [IndividualClientRegistrationDocument](#individualclientregistrationdocument) | `GCRecord` | `/v1/XPDeletedObject/{id}/IndividualClientRegistrationDocument?by=GCRecord` |
| [CurrencyRate](#currencyrate) | `GCRecord` | `/v1/XPDeletedObject/{id}/CurrencyRate?by=GCRecord` |
| [FinObjectTypeDocumentTemplate](#finobjecttypedocumenttemplate) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinObjectTypeDocumentTemplate?by=GCRecord` |
| [LoanPurposeAdditional1](#loanpurposeadditional1) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanPurposeAdditional1?by=GCRecord` |
| [LoanPurposeAdditional2](#loanpurposeadditional2) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanPurposeAdditional2?by=GCRecord` |
| [LoanPurposeAdditional3](#loanpurposeadditional3) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanPurposeAdditional3?by=GCRecord` |
| [ClientLicense](#clientlicense) | `GCRecord` | `/v1/XPDeletedObject/{id}/ClientLicense?by=GCRecord` |
| [NationalEconomySector](#nationaleconomysector) | `GCRecord` | `/v1/XPDeletedObject/{id}/NationalEconomySector?by=GCRecord` |
| [FactoringInvoice](#factoringinvoice) | `GCRecord` | `/v1/XPDeletedObject/{id}/FactoringInvoice?by=GCRecord` |
| [SimpleOperationTemplate](#simpleoperationtemplate) | `GCRecord` | `/v1/XPDeletedObject/{id}/SimpleOperationTemplate?by=GCRecord` |
| [FinProductAccount](#finproductaccount) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinProductAccount?by=GCRecord` |
| [LoanApplicationRejectReason](#loanapplicationrejectreason) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanApplicationRejectReason?by=GCRecord` |
| [ClientBankAccount](#clientbankaccount) | `GCRecord` | `/v1/XPDeletedObject/{id}/ClientBankAccount?by=GCRecord` |
| [FinObjectExtendedProperty](#finobjectextendedproperty) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinObjectExtendedProperty?by=GCRecord` |
| [ASOKIClientType](#asokiclienttype) | `GCRecord` | `/v1/XPDeletedObject/{id}/ASOKIClientType?by=GCRecord` |
| [PropertyInsurancePolicy](#propertyinsurancepolicy) | `GCRecord` | `/v1/XPDeletedObject/{id}/PropertyInsurancePolicy?by=GCRecord` |
| [ClientImageAttachmentType](#clientimageattachmenttype) | `GCRecord` | `/v1/XPDeletedObject/{id}/ClientImageAttachmentType?by=GCRecord` |
| [DirectOrgan](#directorgan) | `GCRecord` | `/v1/XPDeletedObject/{id}/DirectOrgan?by=GCRecord` |
| [RepresentationContractType](#representationcontracttype) | `GCRecord` | `/v1/XPDeletedObject/{id}/RepresentationContractType?by=GCRecord` |
| [PropertyAppraisalReport](#propertyappraisalreport) | `GCRecord` | `/v1/XPDeletedObject/{id}/PropertyAppraisalReport?by=GCRecord` |
| [District](#district) | `GCRecord` | `/v1/XPDeletedObject/{id}/District?by=GCRecord` |
| [ContactInformation](#contactinformation) | `GCRecord` | `/v1/XPDeletedObject/{id}/ContactInformation?by=GCRecord` |
| [LoanApplicationParticipants](#loanapplicationparticipants) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanApplicationParticipants?by=GCRecord` |
| [LoanApplicationDmsRejectReason](#loanapplicationdmsrejectreason) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanApplicationDmsRejectReason?by=GCRecord` |
| [PersistentImage](#persistentimage) | `GCRecord` | `/v1/XPDeletedObject/{id}/PersistentImage?by=GCRecord` |
| [PassportType](#passporttype) | `GCRecord` | `/v1/XPDeletedObject/{id}/PassportType?by=GCRecord` |
| [ASOKICollateralStatus_A13Reference](#asokicollateralstatus_a13reference) | `GCRecord` | `/v1/XPDeletedObject/{id}/ASOKICollateralStatus_A13Reference?by=GCRecord` |
| [FinProduct](#finproduct) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinProduct?by=GCRecord` |
| [Region](#region) | `GCRecord` | `/v1/XPDeletedObject/{id}/Region?by=GCRecord` |
| [Passport](#passport) | `GCRecord` | `/v1/XPDeletedObject/{id}/Passport?by=GCRecord` |
| [GrkiFactoringDisclosureType](#grkifactoringdisclosuretype) | `GCRecord` | `/v1/XPDeletedObject/{id}/GrkiFactoringDisclosureType?by=GCRecord` |
| [BankBranch](#bankbranch) | `GCRecord` | `/v1/XPDeletedObject/{id}/BankBranch?by=GCRecord` |
| [LoanApplicationDmsApproveReason](#loanapplicationdmsapprovereason) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanApplicationDmsApproveReason?by=GCRecord` |
| [FinObjectTypeOperationTemplate](#finobjecttypeoperationtemplate) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinObjectTypeOperationTemplate?by=GCRecord` |
| [GrkiFactoringParticipationType](#grkifactoringparticipationtype) | `GCRecord` | `/v1/XPDeletedObject/{id}/GrkiFactoringParticipationType?by=GCRecord` |
| [Affiliation_RelationHistory](#affiliation_relationhistory) | `GCRecord` | `/v1/XPDeletedObject/{id}/Affiliation_RelationHistory?by=GCRecord` |
| [ASOKILoanApplicationParticipantStatus_A19Reference](#asokiloanapplicationparticipantstatus_a19reference) | `GCRecord` | `/v1/XPDeletedObject/{id}/ASOKILoanApplicationParticipantStatus_A19Reference?by=GCRecord` |
| [LegislativeClientLegalForm](#legislativeclientlegalform) | `GCRecord` | `/v1/XPDeletedObject/{id}/LegislativeClientLegalForm?by=GCRecord` |
| [Bank](#bank) | `GCRecord` | `/v1/XPDeletedObject/{id}/Bank?by=GCRecord` |
| [GrkiFactoringRegressType](#grkifactoringregresstype) | `GCRecord` | `/v1/XPDeletedObject/{id}/GrkiFactoringRegressType?by=GCRecord` |
| [PaymentDocumentType](#paymentdocumenttype) | `GCRecord` | `/v1/XPDeletedObject/{id}/PaymentDocumentType?by=GCRecord` |
| [CollateralRegistryLegislativeClientSmallBusinessType](#collateralregistrylegislativeclientsmallbusinesstype) | `GCRecord` | `/v1/XPDeletedObject/{id}/CollateralRegistryLegislativeClientSmallBusinessType?by=GCRecord` |
| [AccountCodeFormulaSettings](#accountcodeformulasettings) | `GCRecord` | `/v1/XPDeletedObject/{id}/AccountCodeFormulaSettings?by=GCRecord` |
| [UserSettings](#usersettings) | `GCRecord` | `/v1/XPDeletedObject/{id}/UserSettings?by=GCRecord` |
| [ASOKILoanApplicationParticipantType_A18Reference](#asokiloanapplicationparticipanttype_a18reference) | `GCRecord` | `/v1/XPDeletedObject/{id}/ASOKILoanApplicationParticipantType_A18Reference?by=GCRecord` |
| [InitialBalance](#initialbalance) | `GCRecord` | `/v1/XPDeletedObject/{id}/InitialBalance?by=GCRecord` |
| [VehicleType](#vehicletype) | `GCRecord` | `/v1/XPDeletedObject/{id}/VehicleType?by=GCRecord` |
| [Affiliation_Relation](#affiliation_relation) | `GCRecord` | `/v1/XPDeletedObject/{id}/Affiliation_Relation?by=GCRecord` |
| [GroupClientItem](#groupclientitem) | `GCRecord` | `/v1/XPDeletedObject/{id}/GroupClientItem?by=GCRecord` |
| [Branch](#branch) | `GCRecord` | `/v1/XPDeletedObject/{id}/Branch?by=GCRecord` |
| [ContractTemplate](#contracttemplate) | `GCRecord` | `/v1/XPDeletedObject/{id}/ContractTemplate?by=GCRecord` |
| [BaseClient](#baseclient) | `GCRecord` | `/v1/XPDeletedObject/{id}/BaseClient?by=GCRecord` |
| [ASOKIDepositType](#asokideposittype) | `GCRecord` | `/v1/XPDeletedObject/{id}/ASOKIDepositType?by=GCRecord` |
| [GrkiFactoringType](#grkifactoringtype) | `GCRecord` | `/v1/XPDeletedObject/{id}/GrkiFactoringType?by=GCRecord` |
| [ClientBlackListItem](#clientblacklistitem) | `GCRecord` | `/v1/XPDeletedObject/{id}/ClientBlackListItem?by=GCRecord` |
| [CBReportTemplate](#cbreporttemplate) | `GCRecord` | `/v1/XPDeletedObject/{id}/CBReportTemplate?by=GCRecord` |
| [Currency](#currency) | `GCRecord` | `/v1/XPDeletedObject/{id}/Currency?by=GCRecord` |
| [Country](#country) | `GCRecord` | `/v1/XPDeletedObject/{id}/Country?by=GCRecord` |
| [Affiliation_RelationGroupType](#affiliation_relationgrouptype) | `GCRecord` | `/v1/XPDeletedObject/{id}/Affiliation_RelationGroupType?by=GCRecord` |
| [Person](#person) | `GCRecord` | `/v1/XPDeletedObject/{id}/Person?by=GCRecord` |
| [ObjectOfLeasingType](#objectofleasingtype) | `GCRecord` | `/v1/XPDeletedObject/{id}/ObjectOfLeasingType?by=GCRecord` |
| [GrkiFactoringDirectionType](#grkifactoringdirectiontype) | `GCRecord` | `/v1/XPDeletedObject/{id}/GrkiFactoringDirectionType?by=GCRecord` |
| [Affiliation_RelationType](#affiliation_relationtype) | `GCRecord` | `/v1/XPDeletedObject/{id}/Affiliation_RelationType?by=GCRecord` |
| [ClientType](#clienttype) | `GCRecord` | `/v1/XPDeletedObject/{id}/ClientType?by=GCRecord` |
| [NumerationFormulaSettings](#numerationformulasettings) | `GCRecord` | `/v1/XPDeletedObject/{id}/NumerationFormulaSettings?by=GCRecord` |
| [ClientTypeClassifier](#clienttypeclassifier) | `GCRecord` | `/v1/XPDeletedObject/{id}/ClientTypeClassifier?by=GCRecord` |
| [FinObjectTypeAccount](#finobjecttypeaccount) | `GCRecord` | `/v1/XPDeletedObject/{id}/FinObjectTypeAccount?by=GCRecord` |
| [LoanCollateral](#loancollateral) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanCollateral?by=GCRecord` |
| [Numerator](#numerator) | `GCRecord` | `/v1/XPDeletedObject/{id}/Numerator?by=GCRecord` |
| [TagType](#tagtype) | `GCRecord` | `/v1/XPDeletedObject/{id}/TagType?by=GCRecord` |
| [BaseAccountQualifier](#baseaccountqualifier) | `GCRecord` | `/v1/XPDeletedObject/{id}/BaseAccountQualifier?by=GCRecord` |
| [NationalEconomySector2](#nationaleconomysector2) | `GCRecord` | `/v1/XPDeletedObject/{id}/NationalEconomySector2?by=GCRecord` |
| [ScheduleConfiguration](#scheduleconfiguration) | `GCRecord` | `/v1/XPDeletedObject/{id}/ScheduleConfiguration?by=GCRecord` |
| [Tag](#tag) | `GCRecord` | `/v1/XPDeletedObject/{id}/Tag?by=GCRecord` |
| [LoanCollateralType](#loancollateraltype) | `GCRecord` | `/v1/XPDeletedObject/{id}/LoanCollateralType?by=GCRecord` |

## XPObjectType

`dbo.XPObjectType` · 137 qator · PK: OID · 4 ustun

`GET /v1/XPObjectType` · `GET /v1/XPObjectType/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [BaseAccountQualifier](#baseaccountqualifier) | `ObjectType` | `/v1/XPObjectType/{id}/BaseAccountQualifier?by=ObjectType` |
| [BaseClient](#baseclient) | `ObjectType` | `/v1/XPObjectType/{id}/BaseClient?by=ObjectType` |
| [FinProduct](#finproduct) | `ObjectType` | `/v1/XPObjectType/{id}/FinProduct?by=ObjectType` |
| [XPDeletedObject](#xpdeletedobject) | `TargetType` | `/v1/XPObjectType/{id}/XPDeletedObject?by=TargetType` |
| [OperationFormula](#operationformula) | `ObjectType` | `/v1/XPObjectType/{id}/OperationFormula?by=ObjectType` |
| [LoanCollateral](#loancollateral) | `ObjectType` | `/v1/XPObjectType/{id}/LoanCollateral?by=ObjectType` |
| [FinObject](#finobject) | `ObjectType` | `/v1/XPObjectType/{id}/FinObject?by=ObjectType` |
| [BaseAccount](#baseaccount) | `ObjectType` | `/v1/XPObjectType/{id}/BaseAccount?by=ObjectType` |
| [Operation](#operation) | `ObjectType` | `/v1/XPObjectType/{id}/Operation?by=ObjectType` |

## dtproperties

`dbo.dtproperties` · 28 qator · PK: id, property · 7 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## isGUIPermission

`dbo.isGUIPermission` · 5 qator · PK: OID · 10 ustun

`GET /v1/isGUIPermission` · `GET /v1/isGUIPermission/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/isGUIPermission?expand=GCRecord`

## isPermissionTemplate

`dbo.isPermissionTemplate` · 69 qator · PK: OID · 8 ustun

`GET /v1/isPermissionTemplate` · `GET /v1/isPermissionTemplate/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `TableID` | [isTableList](#istablelist) | OID |
| `GroupID` | [isUserGroup](#isusergroup) | OID |

Misol: `/v1/isPermissionTemplate?expand=TableID`

## isTableList

`dbo.isTableList` · 158 qator · PK: OID · 10 ustun

`GET /v1/isTableList` · `GET /v1/isTableList/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [isPermissionTemplate](#ispermissiontemplate) | `TableID` | `/v1/isTableList/{id}/isPermissionTemplate?by=TableID` |

## isUser

`dbo.isUser` · 142 qator · PK: OID · 18 ustun

`GET /v1/isUser` · `GET /v1/isUser/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `Branch` | [Branch](#branch) | OID |
| `Settings` | [UserSettings](#usersettings) | OID |
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |
| `GroupID` | [isUserGroup](#isusergroup) | OID |

Misol: `/v1/isUser?expand=Branch`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [DocumentState](#documentstate) | `User` | `/v1/isUser/{id}/DocumentState?by=User` |
| [Affiliation_Relation](#affiliation_relation) | `CreatedBy` | `/v1/isUser/{id}/Affiliation_Relation?by=CreatedBy` |
| [Document](#document) | `Creator` | `/v1/isUser/{id}/Document?by=Creator` |
| [Affiliation_RelationHistory](#affiliation_relationhistory) | `CreatedBy` | `/v1/isUser/{id}/Affiliation_RelationHistory?by=CreatedBy` |
| [Affiliation_RelationHistory](#affiliation_relationhistory) | `MovedToHistoryBy` | `/v1/isUser/{id}/Affiliation_RelationHistory?by=MovedToHistoryBy` |
| [BackupDatabaseLog](#backupdatabaselog) | `CreatedUserOID` | `/v1/isUser/{id}/BackupDatabaseLog?by=CreatedUserOID` |
| [CloseOperDay_ExecutionProcessState](#closeoperday_executionprocessstate) | `InitiatedUser` | `/v1/isUser/{id}/CloseOperDay_ExecutionProcessState?by=InitiatedUser` |

## isUserGroup

`dbo.isUserGroup` · 6 qator · PK: OID · 10 ustun

`GET /v1/isUserGroup` · `GET /v1/isUserGroup/{OID}` · `/{id}/full` · `/{id}/graph?depth=3`

**Ota (expand):**

| Ustun | → Ota | Ota ustun |
|---|---|---|
| `GCRecord` | [XPDeletedObject](#xpdeletedobject) | OID |

Misol: `/v1/isUserGroup?expand=GCRecord`

**Bolalar:**

| Bola | Ustun | URL |
|---|---|---|
| [isPermissionTemplate](#ispermissiontemplate) | `GroupID` | `/v1/isUserGroup/{id}/isPermissionTemplate?by=GroupID` |
| [isUser](#isuser) | `GroupID` | `/v1/isUserGroup/{id}/isUser?by=GroupID` |

## sysdiagrams

`dbo.sysdiagrams` · 3 qator · PK: diagram_id · 5 ustun

`GET /v1/sysdiagrams` · `GET /v1/sysdiagrams/{diagram_id}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## tblAccounts

`dbo.tblAccounts` · 321 qator · PK: Account · 6 ustun

`GET /v1/tblAccounts` · `GET /v1/tblAccounts/{Account}` · `/{id}/full` · `/{id}/graph?depth=3`

Bog'lanishlari yo'q (mustaqil jadval).

## tmpApplicationEntry

`dbo.tmpApplicationEntry` · 97 qator · PK: yo'q · 8 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/dbo.tmpApplicationEntry`.

## tmpProlongatedLoans

`dbo.tmpProlongatedLoans` · 2 557 qator · PK: Loan, OperDay · 4 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## tmpSchedule

`dbo.tmpSchedule` · 0 qator · PK: FinObjectOID, Date, TemplateCode · 4 ustun

Bitta ustunli PK yo'q: composite PK, ro'yxat orqali filtr.

## tmpTable

`dbo.tmpTable` · 111 qator · PK: yo'q · 3 ustun

Bitta ustunli PK yo'q: faqat `/v1/raw/dbo.tmpTable`.
