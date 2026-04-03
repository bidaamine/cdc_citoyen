import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const participationRegistrationSchema = z
  .object({
    accountType: z.enum(["CITIZEN", "CIVIL_SOCIETY_ORG"]),
    organizationName: z.string().optional(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.email(),
    pseudonym: z.string().min(3),
    wilayaId: z.string().min(1),
    professionalStatusId: z.string().min(1),
    ageRange: z.string().min(1),
    sex: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe doivent correspondre.",
  });

export const reportingRegistrationSchema = participationRegistrationSchema.extend({
  phone: z.string().min(8),
  nin: z.string().min(8),
});

export const profileUpdateSchema = z
  .object({
    phone: z.string().min(8),
    pseudonym: z.string().min(3),
    password: z.string().min(8).optional().or(z.literal("")),
    confirmPassword: z.string().min(8).optional().or(z.literal("")),
  })
  .refine((data) => (data.password || "") === (data.confirmPassword || ""), {
    path: ["confirmPassword"],
    message: "Les mots de passe doivent correspondre.",
  });

export const proposalSchema = z.object({
  titleFr: z.string().min(5),
  titleAr: z.string().min(5),
  descriptionFr: z.string().min(40),
  descriptionAr: z.string().min(40),
  categoryId: z.string().min(1),
  exerciseYear: z.number().int().min(2027),
});

export const reportSchema = z.object({
  subject: z.string().min(5),
  targetEntityName: z.string().min(3),
  targetEntityType: z.enum(["CENTRAL", "LOCAL"]),
  address: z.string().min(5),
  relationToEntity: z.string().min(2),
  circumstance: z.string().min(3),
  factsLocation: z.string().min(3),
  factsPeriodicity: z.string().min(2),
  irregularityDescription: z.string().min(80),
  reportCategoryId: z.string().min(1),
});
