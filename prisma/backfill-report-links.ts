import { PrismaClient, ReportStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const reports = await prisma.report.findMany({
    where: {
      currentStatus: ReportStatus.CONVERTI_EN_THEME,
      generatedProposalId: null,
    },
    select: {
      id: true,
    },
  });

  let updated = 0;

  for (const report of reports) {
    const proposal = await prisma.proposal.findFirst({
      where: {
        descriptionFr: {
          contains: `signalement ${report.id}`,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
      },
    });

    if (!proposal) {
      continue;
    }

    await prisma.report.update({
      where: { id: report.id },
      data: {
        generatedProposalId: proposal.id,
      },
    });

    updated += 1;
    console.log(`Linked report ${report.id} -> proposal ${proposal.id}`);
  }

  console.log(`Backfill complete. ${updated} report link(s) updated.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
