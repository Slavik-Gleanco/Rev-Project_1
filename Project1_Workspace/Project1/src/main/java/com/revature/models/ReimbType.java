package com.revature.models;

public class ReimbType {
	private int typeId;
	private String type;
	
	public ReimbType () {}
	
	public ReimbType(int typeId, String type) {
		super();
		this.typeId = typeId;
		this.type = type;
	}
	
	public ReimbType(int typeId) {
        this.typeId = typeId;

        switch (typeId) {
        case 1:
            this.type = "Lodging";
            break;
        case 2:
            this.type = "Travel";
            break;
        case 3:
            this.type = "Food";
            break;
        case 4:
            this.type = "Other";
            break;
        default:
            this.type = "Other";
        }
    }

    public ReimbType(String type) {
        super();
        this.type = type;

        switch (type) {
        case "Lodging":
            this.typeId = 1;
            break;
        case "Travel":
            this.typeId = 2;
            break;
        case "Food":
            this.typeId = 3;
            break;
        case "Other":
            this.typeId = 4;
            break;
        default:
            this.typeId = 4;
        }
    }

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((type == null) ? 0 : type.hashCode());
		result = prime * result + typeId;
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ReimbType other = (ReimbType) obj;
		if (type == null) {
			if (other.type != null)
				return false;
		} else if (!type.equals(other.type))
			return false;
		if (typeId != other.typeId)
			return false;
		return true;
	}
	public int getTypeId() {
		return typeId;
	}
	public void setTypeId(int typeId) {
		this.typeId = typeId;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	@Override
	public String toString() {
		return "ReimbType [typeId=" + typeId + ", type=" + type + "]";
	}
	
}
