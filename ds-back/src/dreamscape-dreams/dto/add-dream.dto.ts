export class AddDreamDto {
  readonly date: string;
  readonly dreams: Record<string, string>[];
  readonly keywords: string[];
}
