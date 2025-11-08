package com.zan.school.library.backend.model.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RentRequestDto {
    public Long memberId;
    public Long bookId;
    public String dueDate;
}
