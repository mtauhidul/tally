"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface PersonalitySettings {
  name: string;
  systemPrompt: string;
  examples: string[];
  temperature: number;
  active: boolean;
}

interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  category: string;
}

export default function AdminPage() {
  // Personality settings
  const [personalities, setPersonalities] = useState<PersonalitySettings[]>([
    {
      name: "best-friend",
      systemPrompt:
        "you are a best friend who happens to be super into nutrition. you're supportive, casual, and understanding. use emojis occasionally and keep things light and fun. respond in lowercase text only. your name is nibble.",
      examples: [
        "hey there! 👋 ready to track some meals? what have you eaten today?",
        "omg that chicken salad sounds delicious! i've logged it - about 320 calories. how was it?",
        "no worries if you went over your calorie goal today! 💕 tomorrow is a fresh start. want me to suggest some lighter options for tomorrow?",
      ],
      temperature: 0.7,
      active: true,
    },
    {
      name: "professional-coach",
      systemPrompt:
        "you are a professional nutritionist and fitness coach. you provide evidence-based advice in a clear, confident manner. you're encouraging but direct. respond in lowercase text only. your name is nibble.",
      examples: [
        "welcome to niblet.ai. i'll help you reach your goals through data-driven insights and evidence-based recommendations. what would you like to log today?",
        "i've recorded your grilled chicken salad. this meal provides approximately 320 calories, 28g protein, 12g carbs, and 18g fat. excellent choice for your protein goal.",
        "you're currently 245 calories under your daily target. consider adding a protein-rich snack to optimize your recovery from today's workout.",
      ],
      temperature: 0.3,
      active: true,
    },
    {
      name: "tough-love",
      systemPrompt:
        "you are a no-nonsense, tough-love nutrition coach. you're direct, sometimes sarcastic, and push people to be accountable. you don't sugarcoat things but you're ultimately supportive of goals. respond in lowercase text only. your name is nibble.",
      examples: [
        "let's cut to the chase. your goal is 195 lbs, and you're currently at 212. what did you eat today? be honest - i'll know if you're not.",
        "a burger and fries? that's about 850 calories and most of your fat for the day. was it worth it? let's make sure dinner is on point to balance this out.",
        "you've been consistent for 5 days straight. finally! keep this up and you'll actually see results this time.",
      ],
      temperature: 0.6,
      active: true,
    },
  ]);

  // Prompt templates
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([
    {
      id: "1",
      name: "meal logging",
      template:
        "user has logged a meal: {meal_description}. calories: {calories}, protein: {protein}g, carbs: {carbs}g, fat: {fat}g. acknowledge the entry, offer an encouraging comment based on how it fits their daily targets, and ask about how they enjoyed the meal.",
      category: "logging",
    },
    {
      id: "2",
      name: "weight update",
      template:
        "user has logged a new weight of {weight} lbs. their previous weight was {previous_weight} lbs, which is a {change_direction} of {change_amount} lbs. their goal weight is {goal_weight} lbs. acknowledge their progress, offer encouragement, and suggest next steps.",
      category: "logging",
    },
    {
      id: "3",
      name: "meal recommendation",
      template:
        "user is asking for a meal recommendation with approximately {target_calories} calories. they prefer {cuisine_preference} food and have dietary preferences: {dietary_restrictions}. suggest a specific meal with ingredients and approximate macros.",
      category: "recommendations",
    },
  ]);

  // New personality form
  const [newPersonality, setNewPersonality] = useState<PersonalitySettings>({
    name: "",
    systemPrompt: "",
    examples: [""],
    temperature: 0.7,
    active: true,
  });

  // New prompt template form
  const [newPromptTemplate, setNewPromptTemplate] = useState<PromptTemplate>({
    id: Date.now().toString(),
    name: "",
    template: "",
    category: "logging",
  });

  // Selected personality for editing
  const [selectedPersonality, setSelectedPersonality] =
    useState<string>("best-friend");

  // Get the currently selected personality data
  const currentPersonality =
    personalities.find((p) => p.name === selectedPersonality) ||
    personalities[0];

  // Handle personality update
  const handlePersonalityUpdate = () => {
    setPersonalities(
      personalities.map((p) =>
        p.name === selectedPersonality ? currentPersonality : p
      )
    );

    toast.success("personality settings updated", {
      description: `changes to ${selectedPersonality} have been saved.`,
    });
  };

  // Add new personality
  const handleAddPersonality = () => {
    if (!newPersonality.name || !newPersonality.systemPrompt) {
      toast.error("required fields missing", {
        description: "please provide at least a name and system prompt.",
      });
      return;
    }

    setPersonalities([...personalities, newPersonality]);
    setNewPersonality({
      name: "",
      systemPrompt: "",
      examples: [""],
      temperature: 0.7,
      active: true,
    });

    toast.success("new personality added", {
      description: `${newPersonality.name} has been added to the list of personalities.`,
    });
  };

  // Add new prompt template
  const handleAddPromptTemplate = () => {
    if (!newPromptTemplate.name || !newPromptTemplate.template) {
      toast.error("required fields missing", {
        description: "please provide at least a name and template text.",
      });
      return;
    }

    setPromptTemplates([
      ...promptTemplates,
      {
        ...newPromptTemplate,
        id: Date.now().toString(),
      },
    ]);
    setNewPromptTemplate({
      id: Date.now().toString(),
      name: "",
      template: "",
      category: "logging",
    });

    toast.success("new prompt template added", {
      description: `${newPromptTemplate.name} has been added to the templates.`,
    });
  };

  // Update a prompt template
  const handleUpdatePromptTemplate = (id: string) => {
    setPromptTemplates(
      promptTemplates.map((pt) => (pt.id === id ? { ...pt } : pt))
    );

    toast.success("prompt template updated", {
      description: "changes to the template have been saved.",
    });
  };

  // Delete a prompt template
  const handleDeletePromptTemplate = (id: string) => {
    setPromptTemplates(promptTemplates.filter((pt) => pt.id !== id));

    toast.success("prompt template deleted", {
      description: "the template has been removed.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">niblet.ai admin panel</h1>

      <Tabs defaultValue="personalities" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personalities">personalities</TabsTrigger>
          <TabsTrigger value="templates">prompt templates</TabsTrigger>
          <TabsTrigger value="settings">ai settings</TabsTrigger>
        </TabsList>

        {/* Personalities Tab */}
        <TabsContent value="personalities" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {/* Personality Selection */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>personalities</CardTitle>
                <CardDescription>
                  manage nibble&apos;s personality styles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {personalities.map((personality) => (
                    <Button
                      key={personality.name}
                      variant={
                        selectedPersonality === personality.name
                          ? "default"
                          : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => setSelectedPersonality(personality.name)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`h-2 w-2 rounded-full mr-2 ${
                            personality.active ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        {personality.name}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personality Editor */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>edit personality: {selectedPersonality}</CardTitle>
                <CardDescription>
                  customize how nibble speaks and interacts with users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="personality-name">name</Label>
                      <Input
                        id="personality-name"
                        value={currentPersonality.name}
                        onChange={(e) =>
                          setPersonalities(
                            personalities.map((p) =>
                              p.name === selectedPersonality
                                ? { ...p, name: e.target.value }
                                : p
                            )
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="personality-temperature">
                        temperature
                      </Label>
                      <div className="pt-2">
                        <Slider
                          id="personality-temperature"
                          min={0}
                          max={1}
                          step={0.1}
                          value={[currentPersonality.temperature]}
                          onValueChange={(value) =>
                            setPersonalities(
                              personalities.map((p) =>
                                p.name === selectedPersonality
                                  ? { ...p, temperature: value[0] }
                                  : p
                              )
                            )
                          }
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>focused (0.0)</span>
                          <span>
                            {currentPersonality.temperature.toFixed(1)}
                          </span>
                          <span>creative (1.0)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="personality-active">active</Label>
                      <Switch
                        id="personality-active"
                        checked={currentPersonality.active}
                        onCheckedChange={(checked) =>
                          setPersonalities(
                            personalities.map((p) =>
                              p.name === selectedPersonality
                                ? { ...p, active: checked }
                                : p
                            )
                          )
                        }
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      when active, this personality can be selected by users
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personality-prompt">system prompt</Label>
                    <Textarea
                      id="personality-prompt"
                      rows={5}
                      value={currentPersonality.systemPrompt}
                      onChange={(e) =>
                        setPersonalities(
                          personalities.map((p) =>
                            p.name === selectedPersonality
                              ? { ...p, systemPrompt: e.target.value }
                              : p
                          )
                        )
                      }
                      placeholder="Enter the system prompt that defines this personality..."
                    />
                    <p className="text-xs text-gray-500">
                      this is the core instruction that shapes how nibble
                      responds
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>example responses</Label>
                    {currentPersonality.examples.map((example, index) => (
                      <div key={index} className="flex gap-2">
                        <Textarea
                          rows={2}
                          value={example}
                          onChange={(e) => {
                            const newExamples = [
                              ...currentPersonality.examples,
                            ];
                            newExamples[index] = e.target.value;
                            setPersonalities(
                              personalities.map((p) =>
                                p.name === selectedPersonality
                                  ? { ...p, examples: newExamples }
                                  : p
                              )
                            );
                          }}
                          placeholder="Example response in this personality style..."
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newExamples =
                              currentPersonality.examples.filter(
                                (_, i) => i !== index
                              );
                            setPersonalities(
                              personalities.map((p) =>
                                p.name === selectedPersonality
                                  ? { ...p, examples: newExamples }
                                  : p
                              )
                            );
                          }}
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newExamples = [
                          ...currentPersonality.examples,
                          "",
                        ];
                        setPersonalities(
                          personalities.map((p) =>
                            p.name === selectedPersonality
                              ? { ...p, examples: newExamples }
                              : p
                          )
                        );
                      }}
                    >
                      add example
                    </Button>
                  </div>

                  <Button onClick={handlePersonalityUpdate}>
                    save changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Add New Personality */}
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>add new personality</CardTitle>
                <CardDescription>
                  create a new way for nibble to interact with users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-personality-name">name</Label>
                      <Input
                        id="new-personality-name"
                        value={newPersonality.name}
                        onChange={(e) =>
                          setNewPersonality({
                            ...newPersonality,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g., motivational-coach"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-personality-temperature">
                        temperature
                      </Label>
                      <div className="pt-2">
                        <Slider
                          id="new-personality-temperature"
                          min={0}
                          max={1}
                          step={0.1}
                          value={[newPersonality.temperature]}
                          onValueChange={(value) =>
                            setNewPersonality({
                              ...newPersonality,
                              temperature: value[0],
                            })
                          }
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>focused (0.0)</span>
                          <span>{newPersonality.temperature.toFixed(1)}</span>
                          <span>creative (1.0)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-personality-prompt">
                      system prompt
                    </Label>
                    <Textarea
                      id="new-personality-prompt"
                      rows={5}
                      value={newPersonality.systemPrompt}
                      onChange={(e) =>
                        setNewPersonality({
                          ...newPersonality,
                          systemPrompt: e.target.value,
                        })
                      }
                      placeholder="Enter the system prompt that defines this personality..."
                    />
                  </div>

                  <Button onClick={handleAddPersonality}>
                    add personality
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Prompt Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>prompt templates</CardTitle>
              <CardDescription>
                manage reusable prompts for common nibble tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {promptTemplates.map((template) => (
                  <div key={template.id} className="space-y-4 border-b pb-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`template-name-${template.id}`}>
                          name
                        </Label>
                        <Input
                          id={`template-name-${template.id}`}
                          value={template.name}
                          onChange={(e) =>
                            setPromptTemplates(
                              promptTemplates.map((t) =>
                                t.id === template.id
                                  ? { ...t, name: e.target.value }
                                  : t
                              )
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`template-category-${template.id}`}>
                          category
                        </Label>
                        <Select
                          value={template.category}
                          onValueChange={(value) =>
                            setPromptTemplates(
                              promptTemplates.map((t) =>
                                t.id === template.id
                                  ? { ...t, category: value }
                                  : t
                              )
                            )
                          }
                        >
                          <SelectTrigger
                            id={`template-category-${template.id}`}
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="logging">logging</SelectItem>
                            <SelectItem value="recommendations">
                              recommendations
                            </SelectItem>
                            <SelectItem value="feedback">feedback</SelectItem>
                            <SelectItem value="other">other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleUpdatePromptTemplate(template.id)
                          }
                        >
                          save
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-500"
                          onClick={() =>
                            handleDeletePromptTemplate(template.id)
                          }
                        >
                          delete
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`template-content-${template.id}`}>
                        template content
                      </Label>
                      <Textarea
                        id={`template-content-${template.id}`}
                        rows={4}
                        value={template.template}
                        onChange={(e) =>
                          setPromptTemplates(
                            promptTemplates.map((t) =>
                              t.id === template.id
                                ? { ...t, template: e.target.value }
                                : t
                            )
                          )
                        }
                      />
                      <p className="text-xs text-gray-500">
                        use {"{variable_name}"} for dynamic content. e.g.,{" "}
                        {"{meal_description}"}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Add new template form */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">add new template</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="new-template-name">name</Label>
                      <Input
                        id="new-template-name"
                        value={newPromptTemplate.name}
                        onChange={(e) =>
                          setNewPromptTemplate({
                            ...newPromptTemplate,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g., daily-summary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-template-category">category</Label>
                      <Select
                        value={newPromptTemplate.category}
                        onValueChange={(value) =>
                          setNewPromptTemplate({
                            ...newPromptTemplate,
                            category: value,
                          })
                        }
                      >
                        <SelectTrigger id="new-template-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="logging">logging</SelectItem>
                          <SelectItem value="recommendations">
                            recommendations
                          </SelectItem>
                          <SelectItem value="feedback">feedback</SelectItem>
                          <SelectItem value="other">other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-template-content">
                      template content
                    </Label>
                    <Textarea
                      id="new-template-content"
                      rows={4}
                      value={newPromptTemplate.template}
                      onChange={(e) =>
                        setNewPromptTemplate({
                          ...newPromptTemplate,
                          template: e.target.value,
                        })
                      }
                      placeholder="Enter template content with {variable_name} placeholders..."
                    />
                  </div>
                  <Button onClick={handleAddPromptTemplate}>
                    add template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ai model settings</CardTitle>
              <CardDescription>
                configure the ai model parameters for nibble
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="model-selection">model</Label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger id="model-selection">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">gpt-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">
                        gpt-3.5-turbo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    select the openai model to use for nibble
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>default parameters</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="max-tokens">max tokens</Label>
                        <span className="text-xs text-gray-500">500</span>
                      </div>
                      <Slider
                        id="max-tokens"
                        defaultValue={[500]}
                        min={100}
                        max={2000}
                        step={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="frequency-penalty">
                          frequency penalty
                        </Label>
                        <span className="text-xs text-gray-500">0.3</span>
                      </div>
                      <Slider
                        id="frequency-penalty"
                        defaultValue={[0.3]}
                        min={0}
                        max={2}
                        step={0.1}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="presence-penalty">
                          presence penalty
                        </Label>
                        <span className="text-xs text-gray-500">0.5</span>
                      </div>
                      <Slider
                        id="presence-penalty"
                        defaultValue={[0.5]}
                        min={0}
                        max={2}
                        step={0.1}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="top-p">top p</Label>
                        <span className="text-xs text-gray-500">0.7</span>
                      </div>
                      <Slider
                        id="top-p"
                        defaultValue={[0.7]}
                        min={0}
                        max={1}
                        step={0.1}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="logging-enabled">
                      enable response logging
                    </Label>
                    <Switch id="logging-enabled" defaultChecked={true} />
                  </div>
                  <p className="text-xs text-gray-500">
                    log all ai responses for quality and improvement
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contextual-memory">contextual memory</Label>
                    <Switch id="contextual-memory" defaultChecked={true} />
                  </div>
                  <p className="text-xs text-gray-500">
                    enable nibble to remember previous conversations with users
                  </p>
                </div>

                <Button>save ai settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
