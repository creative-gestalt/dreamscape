export class UpdateSettingsDto {
  readonly colors: {
    readonly topBarColor: string;
    readonly backgroundColor: string;
    readonly iconColor: string;
    readonly textColor: string;
    readonly completeBtnColor: string;
  };
}
