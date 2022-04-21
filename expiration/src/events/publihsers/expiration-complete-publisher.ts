import { Subjects, Publisher, ExpirationCompleteEvent } from "@marttickets/common"

export class ExpirationCompleteEventPublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete

    
}