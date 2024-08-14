# #  데이터 형식을 확인하는 Python 스크립트
# # 스크립트 설명
# # count_tokens 함수: 주어진 텍스트의 토큰 수를 계산합니다.
# # validate_data_format 함수: 데이터 형식이 올바른지 확인합니다.
# # estimate_cost 함수: 데이터의 총 토큰 수를 계산하고, 주어진 에포크 수와 토큰당 비용을 바탕으로 파인튜닝 작업의 예상 비용을 추정합니다.
# # JSON 파일 로드: training_data.json 파일에서 데이터셋을 로드합니다.
# # 데이터 형식 검증: 데이터 형식을 검증하고, 오류가 있으면 메시지를 출력합니다.
# # 토큰 수 및 비용 추정: 데이터의 총 토큰 수와 파인튜닝 작업의 예상 비용을 출력합니다.
# # 사용 방법
# # training_data.json 파일을 준비합니다. 이 파일은 훈련 데이터셋을 JSON 형식으로 포함해야 합니다.
# # 위의 스크립트를 실행하여 데이터 형식을 확인하고, 토큰 수를 검토하며, 예상 비용을 추정합니다.
# # 이 스크립트를 사용하면 데이터셋의 형식을 쉽게 검증하고 파인튜닝 작업의 비용을 사전에 추정할 수 있습니다

import json
import tiktoken


def count_tokens(text, model):
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        raise ValueError(f"Model {model} is not supported for token counting.")
    return len(encoding.encode(text))


def validate_data_format(data):
    required_keys = {"messages"}
    for item in data:
        if not required_keys.issubset(item.keys()):
            return False, "Missing required keys in data item."
        for message in item["messages"]:
            if "role" not in message or "content" not in message:
                return False, "Each message must have 'role' and 'content'."
    return True, "Data format is valid."


def estimate_cost(data, cost_per_1k_tokens, epochs, model):
    total_tokens = sum(count_tokens(json.dumps(item), model=model) for item in data)
    # total_tokens = 100000
    cost = (total_tokens / 1000) * cost_per_1k_tokens * epochs
    return total_tokens, cost


# JSONL 파일 로드
with open("fine_tuning_sample_1.jsonl", "r", encoding="utf-8") as file:
    data = [json.loads(line) for line in file]

# 데이터 형식 검증
is_valid, message = validate_data_format(data)
if not is_valid:
    print(f"Data format error: {message}")
else:
    print("Data format is valid.")

    # 비용 및 에포크 수 정의
    cost_per_1k_tokens = 0.008  # 1,000 토큰당 비용(예시 값)
    epochs = 3  # 학습 에포크 수(예시 값)

    # 토큰 수 및 비용 추정
    try:
        total_tokens, estimated_cost = estimate_cost(data, cost_per_1k_tokens, epochs, model="gpt-3.5-turbo")
        print(f"Total tokens: {total_tokens}")
        print(f"Estimated cost for {epochs} epochs: ${estimated_cost:.2f} USD")
    except ValueError as e:
        print(e)

