import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { error } = await supabase
    .from("test")
    .select("*")
    .limit(1);

  if (error) {
    return Response.json({
      connected: false,
      message: error.message,
    });
  }

  return Response.json({
    connected: true,
    message: "Supabase connection successful",
  });
}