import { notFound } from "next/navigation";
import { questByDay } from "@/content/quests";
import QuestPlayer from "@/components/QuestPlayer";

export default async function QuestPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const q = questByDay(Number(day));
  if (!q) notFound();
  return <QuestPlayer quest={q} />;
}
