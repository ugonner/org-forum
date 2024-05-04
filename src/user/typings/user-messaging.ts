
export interface IUserMessageConfigDTO {
    messageType: "SMS" | "Email";
    message: string;
    subject: string;
}