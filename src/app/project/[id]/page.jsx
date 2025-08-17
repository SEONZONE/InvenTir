import { supabase } from "@/lib/supabaseClient";
import ProjectForm from "@/src/component/ui/ProjectForm";

export default async function ProjectDetailPage({ params }) {
  const { id } = params;
  const { data: project, error } = await supabase
    .from("PROJECTS")
    .select(
      `
            *,
            PROJECT_MATERIALS(
                *,
                CATEGORY_CODE ( name, unit )
            )
            `
    )
    .eq("project_id", id)
    .single();
  console.log(JSON.stringify(project));
  return <ProjectForm initialData={project} />;
}
