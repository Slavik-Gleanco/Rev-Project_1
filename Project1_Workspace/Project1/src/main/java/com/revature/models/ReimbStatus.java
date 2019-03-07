package com.revature.models;

public class ReimbStatus {
	private int statusId;
	private String status;
	
	public ReimbStatus() {}
	
	public ReimbStatus(int statusId, String status) {
		super();
		this.statusId = statusId;
		this.status = status;
	}

	public ReimbStatus(int statusId) {
        this.statusId = statusId;

        switch (statusId) {
        case 1:
            this.status = "Pending";
            break;
        case 2:
            this.status = "Approved";
            break;
        case 3:
            this.status = "Denied";
            break;
        default:
            this.status = "Pending";
        }
    }

    public ReimbStatus(String type) {
        super();
        this.status = type;

        switch (type) {
        case "Pending":
            this.statusId = 1;
            break;
        case "Approved":
            this.statusId = 2;
            break;
        case "Denied":
            this.statusId = 3;
            break;
        default:
            this.statusId = 1;
        }
    }

	public int getStatusId() {
		return statusId;
	}
	public void setStatusId(int statusId) {
		this.statusId = statusId;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	@Override
	public String toString() {
		return "ReimbStatus [statusId=" + statusId + ", status=" + status + "]";
	}
	
}
