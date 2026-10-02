"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/docs/code-block";
import { SHOWCASE_SOURCE, SHOWCASE_GENERATED, SHOWCASE_USAGE } from "@/lib/showcase";

/**
 * The component showcase: source, generated Rust, and usage.
 *
 * The generated-Rust panel is the persuasive one. "It compiles to Rust" is a
 * claim; showing the shape of the output is evidence. It is labelled as
 * simplified, because the real output also carries make_resolve,
 * make_on_event and the scoped-CSS transform.
 *
 * All three panels are in the static markup (Radix `TabsContent` keeps
 * inactive panels mounted but hidden), so the whole thing is readable without
 * JavaScript — a tab that cannot be opened would otherwise hide real content.
 */
export function Showcase() {
  const t = useTranslations("showcase");
  // Radix Tabs is uncontrolled by default; the client state here is only used
  // to keep the selected panel stable across the locale re-render.
  const [tab, setTab] = useState("component");

  return (
    <div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="component">{t("tabs.component")}</TabsTrigger>
          <TabsTrigger value="generated">{t("tabs.generated")}</TabsTrigger>
          <TabsTrigger value="usage">{t("tabs.usage")}</TabsTrigger>
        </TabsList>

        <TabsContent value="component">
          <CodeBlock
            code={SHOWCASE_SOURCE}
            language="html"
            filename="src/components/TodoInput.vx"
          />
        </TabsContent>

        <TabsContent value="generated">
          <CodeBlock code={SHOWCASE_GENERATED} language="rust" />
          <p className="mt-3 text-sm text-muted">{t("generatedNote")}</p>
        </TabsContent>

        <TabsContent value="usage">
          <CodeBlock code={SHOWCASE_USAGE} language="html" />
        </TabsContent>
      </Tabs>
    </div>
  );
}